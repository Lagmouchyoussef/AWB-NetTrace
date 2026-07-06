CREATE TABLE ai_insights (
    id BIGSERIAL PRIMARY KEY,
    insight_type VARCHAR(30) NOT NULL,
    source VARCHAR(20) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    entity_type VARCHAR(30),
    entity_id BIGINT,
    entity_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(2000) NOT NULL,
    recommended_action VARCHAR(2000),
    confidence DOUBLE PRECISION,
    autonomous_action_taken BOOLEAN NOT NULL DEFAULT false,
    action_details VARCHAR(2000),
    related_anomaly_id BIGINT,
    resolved_at TIMESTAMPTZ,
    notes VARCHAR(1000),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_insights_status ON ai_insights (status);
CREATE INDEX idx_ai_insights_severity ON ai_insights (severity);
