package escrow

import (
	"context"
	"fairlance/internal/domain/events"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func PollJobAssignedEvents(esc *Escrow, start, end uint64) ([]*EscrowJobAssigned, error) {
	iter, err := esc.FilterJobAssigned(&bind.FilterOpts{
		Start: start,
		End:   &end,
	}, []*big.Int{}, []common.Address{})
	if err != nil {
		return nil, err
	}

	var events0 []*EscrowJobAssigned
	for iter.Next() {
		events0 = append(events0, iter.Event)
	}
	return events0, nil
}

func ProcessJobAssignedEvents(events0 []*EscrowJobAssigned) ([]*events.BlockchainEvent, error) {
	var processedEvents []*events.BlockchainEvent
	for _, e := range events0 {
		processedEvents = append(processedEvents, &events.BlockchainEvent{
			EventType:   events.JobAssignedEventType,
			JobID:       uint(e.JobId.Int64()),
			Amount:      "0",
			UserAddress: e.Freelancer.Hex(),
			TxHash:      e.Raw.TxHash.Hex(),
			BlockNumber: e.Raw.BlockNumber,
			BlockHash:   e.Raw.BlockHash.Hex(),
			Timestamp:   time.Now(),
		})
	}
	return processedEvents, nil
}

func StartJobAssignedPolling(
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
		PollJobAssignedEvents,
		ProcessJobAssignedEvents,
	)
}
