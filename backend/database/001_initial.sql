CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY, email VARCHAR(190) NOT NULL UNIQUE, name VARCHAR(190) NOT NULL,
  department VARCHAR(190) NOT NULL DEFAULT 'ยังไม่ระบุ', status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL,
  INDEX idx_users_status (status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id VARCHAR(36) NOT NULL, role_code VARCHAR(50) NOT NULL,
  PRIMARY KEY (user_id, role_code), INDEX idx_user_roles_role (role_code)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS requests (
  id VARCHAR(36) PRIMARY KEY, request_no VARCHAR(30) NOT NULL UNIQUE, type VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL, objective TEXT NOT NULL, description TEXT, department VARCHAR(190) NOT NULL,
  owner_id VARCHAR(36) NOT NULL, owner_name VARCHAR(190) NOT NULL, data_classification VARCHAR(30) NOT NULL,
  status VARCHAR(40) NOT NULL, risk_level VARCHAR(20) NOT NULL, risk_score INT NOT NULL DEFAULT 0,
  conditions TEXT, due_date DATE, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL,
  INDEX idx_requests_status (status), INDEX idx_requests_owner (owner_id), INDEX idx_requests_updated (updated_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS request_timeline (
  id VARCHAR(36) PRIMARY KEY, request_id VARCHAR(36) NOT NULL, action VARCHAR(60) NOT NULL, note TEXT,
  actor_id VARCHAR(36) NOT NULL, actor_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL,
  INDEX idx_timeline_request (request_id, created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS approvals (
  id VARCHAR(36) PRIMARY KEY, request_id VARCHAR(36) NOT NULL, decision VARCHAR(50) NOT NULL, comment TEXT,
  approver_id VARCHAR(36) NOT NULL, approver_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL,
  INDEX idx_approvals_request (request_id, created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS registers (
  id VARCHAR(36) PRIMARY KEY, category VARCHAR(50) NOT NULL, code VARCHAR(30) NOT NULL UNIQUE, name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(190) NOT NULL, department VARCHAR(190) NOT NULL, classification VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL, review_date DATE, details_json JSON, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL,
  INDEX idx_registers_category (category), INDEX idx_registers_review (review_date)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS risks (
  id VARCHAR(36) PRIMARY KEY, code VARCHAR(30) NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, category VARCHAR(50) NOT NULL,
  likelihood INT NOT NULL, impact INT NOT NULL, score INT NOT NULL, level VARCHAR(20) NOT NULL, controls TEXT NOT NULL,
  owner_name VARCHAR(190) NOT NULL, residual_score INT NOT NULL, status VARCHAR(30) NOT NULL, due_date DATE,
  created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL,
  INDEX idx_risks_level (level), INDEX idx_risks_status (status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(36) PRIMARY KEY, incident_no VARCHAR(30) NOT NULL UNIQUE, title VARCHAR(255) NOT NULL, category VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL, status VARCHAR(30) NOT NULL, reporter_id VARCHAR(36) NOT NULL, reporter_name VARCHAR(190) NOT NULL,
  occurred_at DATETIME NOT NULL, description TEXT NOT NULL, response_action TEXT, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL,
  INDEX idx_incidents_severity (severity), INDEX idx_incidents_status (status)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS evidence_files (
  id VARCHAR(36) PRIMARY KEY, entity_type VARCHAR(50) NOT NULL, entity_id VARCHAR(36) NOT NULL, file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(150) NOT NULL, size_bytes BIGINT NOT NULL, drive_file_id VARCHAR(190) NOT NULL, drive_web_url TEXT,
  uploaded_by_id VARCHAR(36) NOT NULL, uploaded_by_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL,
  INDEX idx_evidence_entity (entity_type, entity_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36) NOT NULL, actor_name VARCHAR(190) NOT NULL, action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(60) NOT NULL, entity_id VARCHAR(60) NOT NULL, detail_json JSON, created_at DATETIME NOT NULL,
  INDEX idx_audit_entity (entity_type, entity_id), INDEX idx_audit_created (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  key_name VARCHAR(100) PRIMARY KEY, value_text TEXT, updated_at DATETIME NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
