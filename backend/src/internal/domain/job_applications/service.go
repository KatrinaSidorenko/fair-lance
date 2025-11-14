package jobapplications

type JobApplicationService interface {
	CreateApplication(application *JobApplication) error
	GetApplicationByID(id uint) (*JobApplication, error)
	UpdateApplication(application *JobApplication) error
	GetApplicationByJobAndFreelancer(jobID uint, freelancerID uint) (*JobApplication, error)
	GetAllApplicationsByJobID(jobID uint) ([]*JobApplication, error)
}

type jobApplicationService struct {
	repo JobApplicationRepository
}

func NewJobApplicationService(repo JobApplicationRepository) JobApplicationService {
	return &jobApplicationService{repo: repo}
}

func (s *jobApplicationService) CreateApplication(application *JobApplication) error {
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
