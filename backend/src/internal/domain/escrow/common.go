package escrow

import (
	"context"
	"fairlance/internal/domain/events"
	"log"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"
)

func StartEventPolling[T any](
	ctx context.Context,
	client *ethclient.Client,
	esc *Escrow,
	evtsRepository *events.EventRepository,
	startBlock uint64,
	batchSize uint64,
	tickInterval time.Duration,
	filterFunc func(esc *Escrow, start, end uint64) ([]T, error),
	handleEvents func(evts []T) ([]*events.BlockchainEvent, error),
) {
	ticker := time.NewTicker(tickInterval)
	defer ticker.Stop()

	lastBlock := startBlock

	for {
		select {
		case <-ctx.Done():
			log.Println("🛑 Polling stopped")
			return
		case <-ticker.C:
			header, err := client.HeaderByNumber(ctx, nil)
			if err != nil {
				log.Println("❌ Failed to fetch latest block:", err)
				continue
			}

			currentBlock := header.Number.Uint64()
			if currentBlock <= lastBlock {
				lastBlock = currentBlock
			}

			start := lastBlock + 1
			end := min(currentBlock, start+batchSize)
			//end := currentBlock + 1

			fetchedEvents, err := filterFunc(esc, start, end)
			if err != nil {
				log.Println("❌ Filter error:", err)
				continue
			}

			processedEvents, err := handleEvents(fetchedEvents)
			if err != nil {
				log.Println("❌ Handle events error:", err)
				continue
			}

			// todo: create clever logic for saving without duplicates
			if err := evtsRepository.SaveEvents(processedEvents); err != nil {
				log.Println("❌ Save events error:", err)
				continue
			}

			lastBlock = end
		}
	}
}
