
-- type JobSubmit struct {
-- 	ID               uint      `json:"id" gorm:"primaryKey;autoIncrement"`
-- 	JobApplicationID uint      `json:"job_application_id" gorm:"not null"`
-- 	SubmittedAt      time.Time `json:"submitted_at" gorm:"autoCreateTime"`
-- 	Description      string    `json:"description" gorm:"not null"`
-- 	FileId           uint      `json:"file_id" gorm:"not null"`
-- 	CreatedAt        time.Time `json:"created_at" gorm:"autoCreateTime"`
-- 	UpdatedAt        time.Time `json:"updated_at" gorm:"autoUpdateTime"`
-- }


CREATE TABLE job_submits (
    id SERIAL PRIMARY KEY,
    job_application_id INT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT NOT NULL,
    file_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_job_submit_application
        FOREIGN KEY (job_application_id) REFERENCES job_applications(id) ON DELETE CASCADE,
    CONSTRAINT fk_job_submit_file
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);

CREATE INDEX idx_job_submits_application_id ON job_submits(job_application_id);
