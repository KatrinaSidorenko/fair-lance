package jobapplications

import "time"

type CreateJobApplicationDTO struct {
	JobID             uint   `json:"job_id" binding:"required"`
	FreelancerAddress string `json:"freelancer_address" binding:"required"`
	CoverLetter       string `json:"cover_letter" binding:"required"`
}

type JobApplicationResponseDTO struct {
	ID                uint   `json:"id"`
	JobID             uint   `json:"job_id"`
	FreelancerID      uint   `json:"freelancer_id"`
	FreelancerAddress string `json:"freelancer_address"`
	CoverLetter       string `json:"cover_letter"`
	Status            string `json:"status"`
}

// MAPPERS
func ToJobApplicationResponseDTO(app *JobApplication) *JobApplicationResponseDTO {
	return &JobApplicationResponseDTO{
		ID:                app.ID,
		JobID:             app.JobID,
		FreelancerID:      app.FreelancerID,
		FreelancerAddress: app.FreelancerAddress,
		CoverLetter:       app.CoverLetter,
		Status:            app.Status,
	}
}

func ToJobApplicationResponseDTOs(apps []*JobApplication) []*JobApplicationResponseDTO {
	dtos := make([]*JobApplicationResponseDTO, 0, len(apps))
	for _, app := range apps {
		dtos = append(dtos, ToJobApplicationResponseDTO(app))
	}
	return dtos
}

func ToJobApplication(dto *CreateJobApplicationDTO, freelancerId uint) *JobApplication {
	return &JobApplication{
		JobID:             dto.JobID,
		FreelancerID:      freelancerId,
		FreelancerAddress: dto.FreelancerAddress,
		CoverLetter:       dto.CoverLetter,
		Status:            string(ApplicationStatusPending),
		CreatedAt:         time.Now(),
	}
}
