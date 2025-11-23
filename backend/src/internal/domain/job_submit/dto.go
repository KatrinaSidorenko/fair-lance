package jobsubmit

import "time"

type CreateJobSubmitDTO struct {
	ApplicationID uint   `json:"application_id" binding:"required"`
	Description   string `json:"description" binding:"required"`
	FileId        *uint  `json:"file_id"`
}

type JobSubmitResponseDTO struct {
	ID               uint      `json:"id"`
	JobApplicationID uint      `json:"job_application_id"`
	SubmittedAt      time.Time `json:"submitted_at"`
	Description      string    `json:"description"`
	FileId           *uint     `json:"file_id"`
}

// MAPPERS
func ToJobSubmitResponseDTO(submit *JobSubmit) *JobSubmitResponseDTO {
	return &JobSubmitResponseDTO{
		ID:               submit.ID,
		JobApplicationID: submit.JobApplicationID,
		SubmittedAt:      submit.SubmittedAt,
		Description:      submit.Description,
		FileId:           submit.FileId,
	}
}

func ToJobSubmit(submitDTO *CreateJobSubmitDTO) *JobSubmit {
	return &JobSubmit{
		JobApplicationID: submitDTO.ApplicationID,
		Description:      submitDTO.Description,
		FileId:           submitDTO.FileId,
		SubmittedAt:      time.Now().UTC(),
		CreatedAt:        time.Now().UTC(),
	}
}
