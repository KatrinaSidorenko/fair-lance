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

func PollWithdrawnEvents(esc *Escrow, start, end uint64) ([]*EscrowWithdrawn, error) {
	iter, err := esc.FilterWithdrawn(&bind.FilterOpts{
		Start: start,
		End:   &end,
	}, []*big.Int{}, []common.Address{})
	if err != nil {
		return nil, err
	}

	var events0 []*EscrowWithdrawn
	for iter.Next() {
		events0 = append(events0, iter.Event)
	}
	return events0, nil
}

func ProcessWithdrawnEvents(events0 []*EscrowWithdrawn) ([]*events.BlockchainEvent, error) {
	var processedEvents = make([]*events.BlockchainEvent, 0, len(events0))
	for _, e := range events0 {
		processedEvents = append(processedEvents, &events.BlockchainEvent{
			EventType:   events.JobWithdrawnEventType,
			JobID:       uint(e.JobId.Int64()),
			Amount:      e.Amount.String(),
			UserAddress: e.User.Hex(),
			TxHash:      e.Raw.TxHash.Hex(),
			BlockNumber: e.Raw.BlockNumber,
			BlockHash:   e.Raw.BlockHash.Hex(),
			Timestamp:   time.Now(),
		})
	}
	return processedEvents, nil
}

func StartWithdrawnPolling(
	ctx context.Context,
	client *ethclient.Client,
	esc *Escrow,
	eventsChan chan<- []*events.BlockchainEvent,
	errorChan chan<- error,
	startBlock uint64,
	batchSize uint64,
	tickInterval time.Duration,
) {
	StartEventPolling(
		ctx,
		client,
		esc,
		eventsChan,
		errorChan,
		startBlock,
		batchSize,
		tickInterval,
		PollWithdrawnEvents,
		ProcessWithdrawnEvents,
	)
}
