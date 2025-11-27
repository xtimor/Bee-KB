-- Bee KB Database Schema

-- Knowledge Base Instances
CREATE TABLE IF NOT EXISTS kb_instances (
    id SERIAL PRIMARY KEY,
    owner_user_id VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    root_folder_id VARCHAR(255) NOT NULL UNIQUE,
    root_folder_name VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    kb_instance_id INTEGER REFERENCES kb_instances(id) ON DELETE CASCADE,
    user_email VARCHAR(255),
    action VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync Logs
CREATE TABLE IF NOT EXISTS sync_logs (
    id SERIAL PRIMARY KEY,
    kb_instance_id INTEGER REFERENCES kb_instances(id) ON DELETE CASCADE,
    status VARCHAR(50),
    message TEXT,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_kb_instances_owner ON kb_instances(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_kb_instances_root_folder ON kb_instances(root_folder_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_kb ON activity_logs(kb_instance_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_kb ON sync_logs(kb_instance_id);
