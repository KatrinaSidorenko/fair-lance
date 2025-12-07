package jobsubmit

import "gorm.io/gorm"

type JobSubmitRepository interface {
	Create(submit *JobSubmit) error
	GetByID(id uint) (*JobSubmit, error)
	Update(submit *JobSubmit) error
	GetAllByApplicationID(applicationID uint) ([]*JobSubmit, error)
	GetAllByJobID(jobID uint) ([]*JobSubmit, error)
}

type jobSubmitRepository struct {
	db *gorm.DB
}

func NewJobSubmitRepository(db *gorm.DB) JobSubmitRepository {
	return &jobSubmitRepository{db: db}
}

func (r *jobSubmitRepository) Create(submit *JobSubmit) error {
	if err := r.db.Create(submit).Error; err != nil {
		return err
	}
	return nil
}

func (r *jobSubmitRepository) GetByID(id uint) (*JobSubmit, error) {
	var s JobSubmit
	if err := r.db.First(&s, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &s, nil
}

func (r *jobSubmitRepository) Update(submit *JobSubmit) error {
	if err := r.db.Save(submit).Error; err != nil {
		return err
	}
	return nil
}

func (r *jobSubmitRepository) GetAllByApplicationID(applicationID uint) ([]*JobSubmit, error) {
	var subs []*JobSubmit
	if err := r.db.Where("job_application_id = ?", applicationID).Find(&subs).Error; err != nil {
		return nil, err
	}
	return subs, nil
}

func (r *jobSubmitRepository) GetAllByJobID(jobID uint) ([]*JobSubmit, error) {
	var subs []*JobSubmit
	if err := r.db.
		Joins("JOIN job_applications ON job_applications.id = job_submits.job_application_id").
		Where("job_applications.job_id = ?", jobID).
		Find(&subs).Error; err != nil {
		return nil, err
	}
	return subs, nil
}
