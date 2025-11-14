package events

import (
	"gorm.io/gorm"
)

type EventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) SaveEvent(event *BlockchainEvent) error {
	return r.db.Create(event).Error
}

func (r *EventRepository) SaveEvents(events []*BlockchainEvent) error {
	if len(events) == 0 {
		return nil
	}

	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&events).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *EventRepository) GetAllEvents() ([]BlockchainEvent, error) {
	var events []BlockchainEvent
	err := r.db.Order("created_at desc").Find(&events).Error
	return events, err
}

func (r *EventRepository) GetEventsByType(eventType string) ([]BlockchainEvent, error) {
	var events []BlockchainEvent
	err := r.db.Where("event_type = ?", eventType).Order("created_at desc").Find(&events).Error
	return events, err
}

func (r *EventRepository) GetEventsByBlockRange(start, end uint64) ([]BlockchainEvent, error) {
	var events []BlockchainEvent
	err := r.db.Where("block_number BETWEEN ? AND ?", start, end).
		Order("block_number asc").
		Find(&events).Error
	return events, err
}

func (r *EventRepository) GetLatestBlockNumber() (uint64, error) {
	var event BlockchainEvent
	err := r.db.Order("block_number desc").First(&event).Error
	if err != nil {
		return 0, err
	}
	return event.BlockNumber, nil
}
