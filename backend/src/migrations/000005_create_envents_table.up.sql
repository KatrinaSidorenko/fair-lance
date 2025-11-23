CREATE TABLE blockchain_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(64) NOT NULL,
    job_id INT NOT NULL,
    user_address VARCHAR(128),
    amount VARCHAR(128),
    tx_hash VARCHAR(128) NOT NULL UNIQUE,
    block_number BIGINT NOT NULL,
    block_hash VARCHAR(128),
    chain_id VARCHAR(64),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_processed BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE blockchain_events
ADD CONSTRAINT fk_event_job
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

CREATE INDEX idx_events_type_job_id_tx_hash ON blockchain_events(event_type, job_id, tx_hash);
