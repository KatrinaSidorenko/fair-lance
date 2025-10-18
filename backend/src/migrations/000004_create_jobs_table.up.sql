CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    due_date TIMESTAMP NOT NULL,
    employer_id INT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    budget NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_job_employer
        FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);