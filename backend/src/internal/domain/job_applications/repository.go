package jobapplications

import (
	"gorm.io/gorm"
)

type JobApplicationRepository interface {
	Create(application *JobApplication) error
	GetByID(id uint) (*JobApplication, error)
	Update(application *JobApplication) error
	GetByJobAndFreelancer(jobID uint, freelancerID uint) (*JobApplication, error)
	GetAllByJobID(jobID uint) ([]*JobApplication, error)
	GetByUserID(userID uint) ([]*JobApplication, error)
}

type jobApplicationRepository struct {
	db *gorm.DB
}

func NewJobApplicationRepository(db *gorm.DB) JobApplicationRepository {
	return &jobApplicationRepository{db: db}
}

func (r *jobApplicationRepository) Create(application *JobApplication) error {
	if err := r.db.Create(application).Error; err != nil {
		return err
	}
	return nil
}

func (r *jobApplicationRepository) GetByID(id uint) (*JobApplication, error) {
	var application JobApplication
	if err := r.db.First(&application, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &application, nil
}

func (r *jobApplicationRepository) Update(application *JobApplication) error {
	if err := r.db.Save(application).Error; err != nil {
		return err
	}
	return nil
}

func (r *jobApplicationRepository) GetByJobAndFreelancer(jobID uint, freelancerID uint) (*JobApplication, error) {
	var application JobApplication
	if err := r.db.Where("job_id = ? AND freelancer_id = ?", jobID, freelancerID).First(&application).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &application, nil
}

func (r *jobApplicationRepository) GetAllByJobID(jobID uint) ([]*JobApplication, error) {
	var applications []*JobApplication
	if err := r.db.Where("job_id = ?", jobID).Find(&applications).Error; err != nil {
		return nil, err
	}
	return applications, nil
}

func (r *jobApplicationRepository) GetByUserID(userID uint) ([]*JobApplication, error) {
	var applications []*JobApplication
	if err := r.db.Where("freelancer_id = ?", userID).Find(&applications).Error; err != nil {
		return nil, err
	}
	return applications, nil
}
