package escrow

import (
	"context"
	"fairlance/configs"
	"fairlance/internal/domain/events"
	"log"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func StartEventListener(cfg *configs.Config, eventsRepository *events.EventRepository) {
	rpcURL := cfg.RPCURL
	contractAddress := cfg.ContractAddress

	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		log.Println("❌ Failed to connect to blockchain:", err)
		return
	}
	defer client.Close()

	esc, err := NewEscrow(common.HexToAddress(contractAddress), client)
	if err != nil {
		log.Println("❌ Failed to load contract:", err)
		return
	}

	log.Println("✅ Connected to blockchain. Starting EscrowManager event listeners...")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	latestBlock, _ := eventsRepository.GetLatestBlockNumber()
	startBlock := latestBlock

	eventsChan := make(chan []*events.BlockchainEvent, 100)
	errorChan := make(chan error, 10)

	batchSize := uint64(10)
	tickInterval := 5 * time.Second

	SafeGo(func() {
		StartJobPublishedPolling(ctx, client, esc, eventsChan, errorChan, startBlock, batchSize, tickInterval)
	}, errorChan)

	SafeGo(func() {
		StartJobApprovedPolling(ctx, client, esc, eventsChan, errorChan, startBlock, batchSize, tickInterval)
	}, errorChan)

	SafeGo(func() {
		StartWithdrawnPolling(ctx, client, esc, eventsChan, errorChan, startBlock, batchSize, tickInterval)
	}, errorChan)

	SafeGo(func() {
		StartJobAssignedPolling(ctx, client, esc, eventsChan, errorChan, startBlock, batchSize, tickInterval)
	}, errorChan)

	for {
		select {
		case evts := <-eventsChan:
			if err := eventsRepository.SaveEvents(evts); err != nil {
				log.Println("❌ Save events error:", err)
			}
		case err := <-errorChan:
			log.Println("🚨 FATAL worker error:", err)
		}
	}
}
