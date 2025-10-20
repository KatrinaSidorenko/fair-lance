package files

import "time"

type File struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string    `json:"file_name" gorm:"not null"`
	Size      int64     `json:"size" gorm:"not null"`
	MimeType  string    `json:"mime_type" gorm:"not null"`
	BlobId    uint      `json:"blob_id"` // can be null
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
