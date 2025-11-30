package jobs

type CreateJobDto struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	DueDate     string  `json:"due_date" binding:"required"`
	Budget      float64 `json:"budget" binding:"required,gt=0"`
	Currency    *string `json:"currency" binding:"required,len=3,oneof=ETH wei"`
	Status      string  `json:"status" binding:"omitempty,oneof=draft published assigned approved closed"`
}

type UpdateJobDto struct {
	ID          uint     `json:"id" binding:"required"`
	Title       *string  `json:"title" binding:"omitempty"`
	Description *string  `json:"description" binding:"omitempty"`
	DueDate     *string  `json:"due_date" binding:"omitempty,datetime=2006-01-02"`
	Budget      *float64 `json:"budget" binding:"omitempty,gt=0"`
	Currency    *string  `json:"currency" binding:"omitempty,len=3"`
	Status      *string  `json:"status" binding:"omitempty,oneof=draft published assigned approved closed"`
}

type JobUpdateData struct {
	Status            JobStatus
	FreelancerAddress string
}
