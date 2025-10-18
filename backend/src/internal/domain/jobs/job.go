package jobs

import (
	"fmt"
	"time"
)

type JobStatus string

const (
	JobStatusPending   JobStatus = "draft"
	JobStatusPublished JobStatus = "published"
	JobStatusAssigned  JobStatus = "assigned"
	JobStatusApproved  JobStatus = "approved"
	JobStatusClosed    JobStatus = "closed"
)

func ParseJobStatus(s string) (JobStatus, error) {
	switch JobStatus(s) {
	case JobStatusPending,
		JobStatusPublished,
		JobStatusAssigned,
		JobStatusApproved,
		JobStatusClosed:
		return JobStatus(s), nil
	default:
		return "", fmt.Errorf("invalid job status: %s", s)
	}
}

type Job struct {
	ID          uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description" gorm:"not null"`
	Status      JobStatus `json:"status" gorm:"not null;default:'draft'"`
	DueDate     time.Time `json:"due_date" gorm:"not null"`
	EmployerID  uint      `json:"employer_id" gorm:"not null"`
	Currency    string    `json:"currency" gorm:"not null"`
	Budget      float64   `json:"budget" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}
