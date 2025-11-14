package escrow

import (
	"context"
	"fairlance/internal/domain/events"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/ethclient"
)

func PollJobApprovedEvents(esc *Escrow, start, end uint64) ([]*EscrowJobApproved, error) {
	iter, err := esc.FilterJobApproved(&bind.FilterOpts{
		Start: start,
		End:   &end,
	}, []*big.Int{})
	if err != nil {
		return nil, err
	}

	var events0 []*EscrowJobApproved
	for iter.Next() {
		events0 = append(events0, iter.Event)
	}
	return events0, nil
}

func ProcessJobApprovedEvents(events0 []*EscrowJobApproved) ([]*events.BlockchainEvent, error) {
	var processedEvents []*events.BlockchainEvent
	for _, e := range events0 {
		processedEvents = append(processedEvents, &events.BlockchainEvent{
			EventType:   events.JobApprovedEventType,
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

func StartJobApprovedPolling(
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
		PollJobApprovedEvents,
		ProcessJobApprovedEvents,
	)
}
