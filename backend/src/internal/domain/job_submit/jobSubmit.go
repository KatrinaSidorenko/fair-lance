package jobsubmit

import (
	"time"
)

type JobSubmit struct {
	ID               uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	JobApplicationID uint      `json:"job_application_id" gorm:"not null"`
	SubmittedAt      time.Time `json:"submitted_at" gorm:"autoCreateTime"`
	Description      string    `json:"description" gorm:"not null"`
	FileId           uint      `json:"file_id" gorm:"not null"`
	CreatedAt        time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt        time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
