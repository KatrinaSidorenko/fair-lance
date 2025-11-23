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
	GetAllUserJobs(userId uint) ([]*Job, error)
	GetPublishedJobs() ([]*Job, error)
}

type jobService struct {
	jobRepository JobRepository
}

func NewJobService(repo JobRepository) JobService {
	return &jobService{jobRepository: repo}
}

func (s *jobService) CreateJob(job *Job) error {
	currentDate := helpers.GetCurrentTimeUTC()
	if job.DueDate.Before(currentDate) {
		return fmt.Errorf("due date must be in the future")
	}

	if !helpers.IsCurrencySupported(job.Currency) {
		return fmt.Errorf("unsupported currency: %s", job.Currency)
	}

	FixBudgetAndCurrency([]*Job{job}, helpers.DefaultCurrency)
	return s.jobRepository.Create(job)
}

func (s *jobService) GetJobByID(id uint) (*Job, error) {
	job, err := s.jobRepository.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get job: %w", err)
	}
	if !job.IsActive {
		return nil, gorm.ErrRecordNotFound
	}
	err = FixBudgetAndCurrency([]*Job{job}, helpers.DefaultCurrencyDisplay)
	if err != nil {
		return nil, err
	}
	return job, nil
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
	if dto.Budget != nil || dto.Currency != nil {
		newCurrency := existingJob.Currency
		if dto.Currency != nil {
			if !helpers.IsCurrencySupported(*dto.Currency) {
				return fmt.Errorf("unsupported currency: %s", *dto.Currency)
			}
			newCurrency = *dto.Currency
		}
		newBudget := existingJob.Budget
		if dto.Budget != nil {
			newBudget = *dto.Budget
		}
		// convert to wei for storage
		convertedAmount, err := helpers.ToWei(newBudget, newCurrency)
		if err != nil {
			return fmt.Errorf("failed to convert budget to wei: %w", err)
		}
		existingJob.Budget = convertedAmount
		existingJob.Currency = newCurrency
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
	job, err := s.jobRepository.GetByID(id)
	if err != nil {
		return fmt.Errorf("failed to get job: %w", err)
	}
	if job == nil {
		return gorm.ErrRecordNotFound
	}
	job.IsActive = false
	return s.jobRepository.Update(job)
}

func (s *jobService) GetAllUserJobs(userId uint) ([]*Job, error) {
	var jobs []*Job
	var err error
	jobs, err = s.jobRepository.GetAllByUserID(userId)
	if err != nil {
		return nil, fmt.Errorf("failed to get user jobs: %w", err)
	}

	// todo: it will better to filter on db level
	activeJobs := make([]*Job, 0)
	for _, job := range jobs {
		if job.IsActive {
			activeJobs = append(activeJobs, job)
		}
	}

	err = FixBudgetAndCurrency(activeJobs, helpers.DefaultCurrencyDisplay)
	if err != nil {
		return nil, err
	}

	return activeJobs, nil
}

func FixBudgetAndCurrency(jobs []*Job, targetCurrency string) error {
	for _, job := range jobs {
		convertedAmount, err := helpers.FromWei(job.Budget, targetCurrency)
		if err != nil {
			return fmt.Errorf("failed to convert budget from wei: %w", err)
		}
		job.Budget = convertedAmount
		job.Currency = targetCurrency
	}
	return nil
}

func (s *jobService) GetPublishedJobs() ([]*Job, error) {
	jobs, err := s.jobRepository.GetAllJobsByStatus(JobStatusPublished)
	if err != nil {
		return nil, fmt.Errorf("failed to get published jobs: %w", err)
	}

	err = FixBudgetAndCurrency(jobs, helpers.DefaultCurrencyDisplay)
	if err != nil {
		return nil, err
	}

	return jobs, nil
}
