package jobapplications

import "time"

type JobApplication struct {
	ID                uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	JobID             uint      `json:"job_id" gorm:"not null"`
	FreelancerID      uint      `json:"freelancer_id" gorm:"not null"`
	FreelancerAddress string    `json:"freelancer_address" gorm:"not null"`
	CoverLetter       string    `json:"cover_letter" gorm:"not null"`
	Status            string    `json:"status" gorm:"not null;default:'pending'"`
	CreatedAt         time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt         time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

type ApplicationStatus string

const (
	ApplicationStatusPending   ApplicationStatus = "pending"
	ApplicationStatusAccepted  ApplicationStatus = "accepted"
	ApplicationStatusRejected  ApplicationStatus = "rejected"
	ApplicationStatusWithdrawn ApplicationStatus = "withdrawn"
	ApplicationStatusClosed    ApplicationStatus = "closed"
)
