package events

import (
	"context"
	jobapplications "fairlance/internal/domain/job_applications"
	"fairlance/internal/domain/jobs"
	"log"
	"sort"
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

	// todo: idea to change on bulk update
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

func sortEventsAsc(events []*BlockchainEvent) {
	sort.Slice(events, func(i, j int) bool {
		return events[i].Timestamp.Before(events[j].Timestamp)
	})
	// now iterate in time order
	for _, ev := range events {
		// handle ev
		_ = ev
	}
}

func processJobEvents(jobID uint, events []*BlockchainEvent, jobRepository jobs.JobRepository) error {
	job, err := jobRepository.GetByID(jobID)
	if err != nil {
		return err
	}

	jobApp := (*jobapplications.JobApplication)(nil)

	sortEventsAsc(events)
	for _, ev := range events {
		switch ev.EventType {
		case JobPublishedEventType:
			job.Status = jobs.JobStatusPublished
		case JobAssignedEventType:
			job.Status = jobs.JobStatusAssigned
			jobApp, err := jobRepository.GetJobApplicationByFreelancerAddress(jobID, ev.UserAddress)
			if err != nil {
				return err
			}
			if jobApp != nil {
				jobApp.Status = string(jobapplications.ApplicationStatusAccepted)
			}
		case JobApprovedEventType:
			job.Status = jobs.JobStatusApproved
			jobApp, err := jobRepository.GetAcceptedApplicationForJob(jobID)
			if err != nil {
				return err
			}
			if jobApp != nil {
				jobApp.Status = string(jobapplications.ApplicationStatusApproved)
			}
		case JobWithdrawnEventType:
			jobApp, err := jobRepository.GetApprovedApplicationForJob(jobID)
			if err != nil {
				return err
			}
			if jobApp != nil {
				jobApp.Status = string(jobapplications.ApplicationStatusClosed)
			}
			job.Status = jobs.JobStatusClosed
		}
	}

	if err := jobRepository.Update(job); err != nil {
		return err
	}

	if jobApp != nil {
		if err := jobRepository.UpdateJobApplication(jobApp); err != nil {
			return err
		}
	}

	return nil
}

func markEventsAsProcessed(eventIDs []uint, evntRepository *EventRepository) error {
	return evntRepository.MarkEventsAsProcessed(eventIDs)
}
