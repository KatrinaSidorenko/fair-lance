package jobs

import (
	"fmt"

	"fairlance/internal/helpers"

	"gorm.io/gorm"
)

type JobService interface {
	CreateJob(job *Job) error
	GetJobByID(id uint) (*Job, error)
	UpdateJob(job *UpdateJobDto) error
	DeleteJob(id uint) error
}

type jobService struct {
	jobRepository JobRepository
}

func NewJobService(repo JobRepository) JobService {
	return &jobService{jobRepository: repo}
}

func (s *jobService) CreateJob(job *Job) error {
	// todo: add time check
	return s.jobRepository.Create(job)
}
func (s *jobService) GetJobByID(id uint) (*Job, error) {
	return s.jobRepository.GetByID(id)
}
func (s *jobService) UpdateJob(dto *UpdateJobDto) error {
	existingJob, err := s.jobRepository.GetByID(dto.ID)
	if err != nil {
		return fmt.Errorf("failed to get job: %w", err)
	}
	if existingJob == nil {
		return gorm.ErrRecordNotFound
	}

	if dto.Title != nil {
		existingJob.Title = *dto.Title
	}
	if dto.Description != nil {
		existingJob.Description = *dto.Description
	}
	if dto.DueDate != nil {
		parsedDueTime, err := helpers.ParseISO8601Date(*dto.DueDate)
		if err != nil {
			return fmt.Errorf("invalid due date format: %w", err)
		}
		existingJob.DueDate = parsedDueTime
	}
	if dto.Budget != nil {
		existingJob.Budget = *dto.Budget
	}
	if dto.Currency != nil {
		existingJob.Currency = *dto.Currency
	}
	if dto.Status != nil {
		parsedStatus, err := ParseJobStatus(*dto.Status)
		if err != nil {
			return fmt.Errorf("invalid job status: %w", err)
		}
		existingJob.Status = parsedStatus
	}

	return s.jobRepository.Update(existingJob)
}

func (s *jobService) DeleteJob(id uint) error {
	return s.jobRepository.Delete(id)
}
