ALTER TABLE interventions
  ADD COLUMN assigned_technician_id BIGINT REFERENCES users (id);

CREATE INDEX idx_interventions_assigned_technician_id ON interventions (assigned_technician_id);

ALTER TABLE interventions DROP COLUMN assigned_technician;
