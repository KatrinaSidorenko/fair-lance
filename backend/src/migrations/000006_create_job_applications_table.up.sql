CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    freelancer_address VARCHAR(255) NOT NULL,
    cover_letter TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_application_job
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_application_freelancer
        FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_applications_job_id_freelancer_id ON job_applications(job_id, freelancer_id);