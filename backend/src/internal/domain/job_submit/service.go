package jobsubmit

import (
	jobapplications "fairlance/internal/domain/job_applications"
	"fmt"
)

type JobSubmitService interface {
	CreateSubmit(submit *JobSubmit) error
	GetSubmitByID(id uint) (*JobSubmit, error)
	UpdateSubmit(submit *JobSubmit) error
	GetAllByApplicationID(applicationID uint) ([]*JobSubmit, error)
	GetAllByJobID(jobID uint) ([]*JobSubmit, error)
}

type jobSubmitService struct {
	repo       JobSubmitRepository
	jobAppRepo jobapplications.JobApplicationRepository
}

func NewJobSubmitService(repo JobSubmitRepository, jobAppRepo jobapplications.JobApplicationRepository) JobSubmitService {
	return &jobSubmitService{repo: repo, jobAppRepo: jobAppRepo}
}

func (s *jobSubmitService) CreateSubmit(submit *JobSubmit) error {
	jobapplication, err := s.jobAppRepo.GetByID(submit.JobApplicationID)
	if err != nil || jobapplication == nil {
		return fmt.Errorf("job application not found")
	}
	return s.repo.Create(submit)
}

func (s *jobSubmitService) GetSubmitByID(id uint) (*JobSubmit, error) {
	return s.repo.GetByID(id)
}

func (s *jobSubmitService) UpdateSubmit(submit *JobSubmit) error {
	return s.repo.Update(submit)
}

func (s *jobSubmitService) GetAllByApplicationID(applicationID uint) ([]*JobSubmit, error) {
	jobApplication, err := s.jobAppRepo.GetByID(applicationID)
	if err != nil || jobApplication == nil {
		return nil, fmt.Errorf("job application not found")
	}
	return s.repo.GetAllByApplicationID(applicationID)
}

func (s *jobSubmitService) GetAllByJobID(jobID uint) ([]*JobSubmit, error) {
	return s.repo.GetAllByJobID(jobID)
}
