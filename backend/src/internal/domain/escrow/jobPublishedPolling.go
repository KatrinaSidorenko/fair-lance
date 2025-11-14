package escrow

import (
	"context"
	"fairlance/internal/domain/events"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/ethclient"
)

func PollJobPublishedEvents(esc *Escrow, start, end uint64) ([]*EscrowJobPublished, error) {
	iter, err := esc.FilterJobPublished(&bind.FilterOpts{
		Start: start,
		End:   &end,
	}, []*big.Int{})
	if err != nil {
		return nil, err
	}

	var events0 []*EscrowJobPublished
	for iter.Next() {
		events0 = append(events0, iter.Event)
	}
	return events0, nil
}

func ProcessJobPublishedEvents(events0 []*EscrowJobPublished) ([]*events.BlockchainEvent, error) {
	var processedEvents = make([]*events.BlockchainEvent, 0, len(events0))
	for _, e := range events0 {
		processedEvents = append(processedEvents, &events.BlockchainEvent{
			EventType:   events.JobPublishedEventType,
			JobID:       e.JobId.String(),
			Amount:      e.Amount.String(),
			TxHash:      e.Raw.TxHash.Hex(),
			BlockNumber: e.Raw.BlockNumber,
			BlockHash:   e.Raw.BlockHash.Hex(),
			Timestamp:   time.Now(),
		})
	}
	return processedEvents, nil
}

func StartJobPublishedPolling(
	ctx context.Context,
	client *ethclient.Client,
	esc *Escrow,
	eventsRepository *events.EventRepository,
	startBlock uint64,
	batchSize uint64,
	tickInterval time.Duration,
) {
	StartEventPolling(
		ctx,
		client,
		esc,
		eventsRepository,
		startBlock,
		batchSize,
		tickInterval,
		PollJobPublishedEvents,
		ProcessJobPublishedEvents,
	)
}
