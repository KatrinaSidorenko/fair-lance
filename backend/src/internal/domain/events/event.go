package events

import "time"

type BlockchainEvent struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	EventType   string    `json:"event_type"`   // e.g. JobPublished, JobApproved, Withdrawn
	JobID       string    `json:"job_id"`       // Job identifier from contract
	UserAddress string    `json:"user_address"` // optional, e.g. freelancer address
	Amount      string    `json:"amount"`       // in wei, store as string to avoid precision loss
	TxHash      string    `json:"tx_hash"`      // transaction hash
	BlockNumber uint64    `json:"block_number"` // block number
	BlockHash   string    `json:"block_hash"`   // block hash
	ChainID     string    `json:"chain_id"`     // network ID for multi-chain support. Not stores for now
	Timestamp   time.Time `json:"timestamp"`    // when event was recorded
	CreatedAt   time.Time `json:"created_at"`
}

const (
	JobPublishedEventType = "JobPublished"
	JobApprovedEventType  = "JobApproved"
	WithdrawnEventType    = "Withdrawn"
)
