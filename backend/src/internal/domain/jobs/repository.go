package jobs

import (
	jobapplications "fairlance/internal/domain/job_applications"

	"gorm.io/gorm"
)

type JobRepository interface {
	Create(job *Job) error
	GetByID(id uint) (*Job, error)
	Update(job *Job) error
	UpdateJobStatus(id uint, status JobStatus) error
	Delete(id uint) error
	GetAllByUserID(userId uint) ([]*Job, error)
	GetAllJobsByStatus(status JobStatus) ([]*Job, error)
}

type jobRepository struct {
	db *gorm.DB
}

func NewJobRepository(db *gorm.DB) JobRepository {
	return &jobRepository{db: db}
}

func (r *jobRepository) Create(job *Job) error {
	if err := r.db.Create(job).Error; err != nil {
		return err
	}
	return nil
}

func (r *jobRepository) GetByID(id uint) (*Job, error) {
	var job Job
	if err := r.db.First(&job, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &job, nil
}

func (r *jobRepository) Update(job *Job) error {
	if err := r.db.Save(job).Error; err != nil {
		return err
	}
	return nil
}

func (r *jobRepository) UpdateJobStatus(id uint, status JobStatus) error {
	// todo: realy bad place for this logic
	if status == JobStatusApproved {
		var jobApp jobapplications.JobApplication
		if err := r.db.Where("job_id = ? AND status = ?", id, string(jobapplications.ApplicationStatusAccepted)).First(&jobApp).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil
			}
			return err
		}
		jobApp.Status = string(jobapplications.ApplicationStatusApproved)
		if err := r.db.Save(&jobApp).Error; err != nil {
			return err
		}
	}

	if status == JobStatusClosed {
		var jobApp jobapplications.JobApplication
		if err := r.db.Where("job_id = ? AND status IN ?", id, []string{string(jobapplications.ApplicationStatusApproved)}).First(&jobApp).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil
			}
			return err
		}
		jobApp.Status = string(jobapplications.ApplicationStatusClosed)
		if err := r.db.Save(&jobApp).Error; err != nil {
			return err
		}
	}
	return r.db.Model(&Job{}).Where("id = ?", id).Update("status", status).Error
}

func (r *jobRepository) Delete(id uint) error {
	if err := r.db.Delete(&Job{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (r *jobRepository) GetAllByUserID(userId uint) ([]*Job, error) {
	var jobs []*Job
	if err := r.db.Where("user_id = ?", userId).Find(&jobs).Error; err != nil {
		return nil, err
	}
	return jobs, nil
}

func (r *jobRepository) GetAllJobsByStatus(status JobStatus) ([]*Job, error) {
	var jobs []*Job
	if err := r.db.Where("status = ? and is_active = ?", status, true).Find(&jobs).Error; err != nil {
		return nil, err
	}
	return jobs, nil
}
