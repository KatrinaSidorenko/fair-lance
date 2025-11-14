package events

import (
	"context"
	"fairlance/internal/domain/jobs"
	"log"
	"time"
)

func ProcessEvents(
	ctx context.Context,
	batchSize int,
	interval time.Duration,
	evntRepository *EventRepository,
	jobRepository jobs.JobRepository,
) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	log.Println("⚙️  Event processor started...")

	for {
		select {

		case <-ctx.Done():
			log.Println("🛑 Event processor stopped (context cancelled).")
			return

		case <-ticker.C:
			processedIDs, err := eventsIterator(batchSize, evntRepository, jobRepository)
			if err != nil {
				log.Println("❌ EventsIterator error:", err)
				continue
			}

			if len(processedIDs) == 0 {
				continue
			}

			if err := markEventsAsProcessed(processedIDs, evntRepository); err != nil {
				log.Println("❌ MarkEventsAsProcessed error:", err)
				continue
			}

			log.Printf("✅ Processed %d events\n", len(processedIDs))
		}
	}
}

func eventsIterator(batchSize int, evntRepository *EventRepository, jobRepository jobs.JobRepository) ([]uint, error) {
	evnts, err := evntRepository.GetUnprocessedEvents(batchSize)
	if err != nil {
		return nil, err
	}

	if len(evnts) == 0 {
		return nil, nil
	}

	grouped := make(map[uint][]*BlockchainEvent)
	for _, e := range evnts {
		grouped[e.JobID] = append(grouped[e.JobID], &e)
	}

	processedIDs := []uint{}

	for jobID, jobEvents := range grouped {
		if err := processJobEvents(jobID, jobEvents, jobRepository); err != nil {
			return nil, err
		}

		// Add event IDs as processed
		for _, e := range jobEvents {
			processedIDs = append(processedIDs, e.ID)
		}
	}

	return processedIDs, nil
}

func processJobEvents(jobID uint, events []*BlockchainEvent, jobRepository jobs.JobRepository) error {
	var newStatus jobs.JobStatus

	for _, ev := range events {
		switch ev.EventType {

		case JobPublishedEventType:
			newStatus = jobs.JobStatusPublished
		case JobApprovedEventType:
			newStatus = jobs.JobStatusApproved
		case JobWithdrawnEventType:
			newStatus = jobs.JobStatusClosed
		}
	}

	if newStatus != "" {
		return jobRepository.UpdateJobStatus(jobID, newStatus)
	}

	return nil
}

func markEventsAsProcessed(eventIDs []uint, evntRepository *EventRepository) error {
	return evntRepository.MarkEventsAsProcessed(eventIDs)
}

// todo: create request of freelancers (frelancer_job) + assign logic
