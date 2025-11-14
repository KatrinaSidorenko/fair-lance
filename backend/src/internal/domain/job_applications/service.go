package jobapplications

import "gorm.io/gorm"

type JobApplicationService interface {
	CreateApplication(application *JobApplication) error
	GetApplicationByID(id uint) (*JobApplication, error)
	UpdateApplication(application *JobApplication) error
	GetApplicationByJobAndFreelancer(jobID uint, freelancerID uint) (*JobApplication, error)
	GetAllApplicationsByJobID(jobID uint) ([]*JobApplication, error)
	AcceptJobApplication(applicationID uint) error
}

type jobApplicationService struct {
	repo JobApplicationRepository
}

func NewJobApplicationService(repo JobApplicationRepository) JobApplicationService {
	return &jobApplicationService{repo: repo}
}

func (s *jobApplicationService) CreateApplication(application *JobApplication) error {
	existsingApp, err := s.repo.GetByJobAndFreelancer(application.JobID, application.FreelancerID)
	if err != nil {
		return err
	}
	if existsingApp != nil {
		return gorm.ErrInvalidData
	}
	return s.repo.Create(application)
}
func (s *jobApplicationService) GetApplicationByID(id uint) (*JobApplication, error) {
	return s.repo.GetByID(id)
}

func (s *jobApplicationService) UpdateApplication(application *JobApplication) error {
	return s.repo.Update(application)
}
func (s *jobApplicationService) GetApplicationByJobAndFreelancer(jobID uint, freelancerID uint) (*JobApplication, error) {
	return s.repo.GetByJobAndFreelancer(jobID, freelancerID)
}

func (s *jobApplicationService) GetAllApplicationsByJobID(jobID uint) ([]*JobApplication, error) {
	return s.repo.GetAllByJobID(jobID)
}

func (s *jobApplicationService) AcceptJobApplication(applicationID uint) error {
	application, err := s.repo.GetByID(applicationID)
	if err != nil {
		return err
	}
	if application == nil {
		return gorm.ErrRecordNotFound
	}

	allApplications, err := s.repo.GetAllByJobID(application.JobID)
	if err != nil {
		return err
	}
	for _, app := range allApplications {
		if app.ID != application.ID && app.Status == string(ApplicationStatusAccepted) {
			return gorm.ErrInvalidData
		}
	}

	application.Status = string(ApplicationStatusAccepted)
	return s.repo.Update(application)
}
