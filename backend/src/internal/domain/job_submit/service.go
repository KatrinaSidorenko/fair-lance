package jobsubmit

type JobSubmitService interface {
	CreateSubmit(submit *JobSubmit) error
	GetSubmitByID(id uint) (*JobSubmit, error)
	UpdateSubmit(submit *JobSubmit) error
	GetAllByApplicationID(applicationID uint) ([]*JobSubmit, error)
	GetAllByJobID(jobID uint) ([]*JobSubmit, error)
}

type jobSubmitService struct {
	repo JobSubmitRepository
}

func NewJobSubmitService(repo JobSubmitRepository) JobSubmitService {
	return &jobSubmitService{repo: repo}
}

func (s *jobSubmitService) CreateSubmit(submit *JobSubmit) error {
	return s.repo.Create(submit)
}

func (s *jobSubmitService) GetSubmitByID(id uint) (*JobSubmit, error) {
	return s.repo.GetByID(id)
}

func (s *jobSubmitService) UpdateSubmit(submit *JobSubmit) error {
	return s.repo.Update(submit)
}

func (s *jobSubmitService) GetAllByApplicationID(applicationID uint) ([]*JobSubmit, error) {
	return s.repo.GetAllByApplicationID(applicationID)
}

func (s *jobSubmitService) GetAllByJobID(jobID uint) ([]*JobSubmit, error) {
	return s.repo.GetAllByJobID(jobID)
}
