package blobs

import "time"

type Blob struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Content   []byte    `json:"content" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
