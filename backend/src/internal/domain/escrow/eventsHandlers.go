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

	ctx := context.Background()

	latestBlock, _ := eventsRepository.GetLatestBlockNumber()
	startBlock := latestBlock
	const (
		batchSize    = 10              // number of blocks to scan per batch
		tickInterval = 5 * time.Second // polling frequency
	)

	go StartJobPublishedPolling(ctx, client, esc, eventsRepository, startBlock, batchSize, tickInterval)
	go StartJobApprovedPolling(ctx, client, esc, eventsRepository, startBlock, batchSize, tickInterval)
	go StartWithdrawnPolling(ctx, client, esc, eventsRepository, startBlock, batchSize, tickInterval)
}
