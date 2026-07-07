ALTER TABLE interventions
  ADD COLUMN requested_by BIGINT REFERENCES users (id),
  ADD COLUMN approved_by BIGINT REFERENCES users (id),
  ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
  ADD COLUMN approval_comment VARCHAR(500),
  ADD COLUMN decided_at TIMESTAMPTZ;

CREATE INDEX idx_interventions_approval_status ON interventions (approval_status);
