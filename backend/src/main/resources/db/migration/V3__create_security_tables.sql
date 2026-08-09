-- =====================================================================
-- Migration V3: Create Security Tables (RBAC & PBAC)
-- =====================================================================

-- 1. Create Roles Table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Create Capabilities Table
CREATE TABLE capabilities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- 3. Create Join Table for Many-To-Many relationship between Roles and Capabilities
CREATE TABLE roles_capabilities (
    role_id BIGINT NOT NULL,
    capability_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, capability_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_capability FOREIGN KEY (capability_id) REFERENCES capabilities(id) ON DELETE CASCADE
);

-- 4. Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    role_id BIGINT NOT NULL,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- =====================================================================
-- Initial Data Seeding (Roles & Capabilities)
-- =====================================================================

-- Insert basic capabilities
INSERT INTO capabilities (name, description) VALUES
    ('VIEW_METRICS', 'Allows the user to view dashboard metrics'),
    ('TRIGGER_ETL', 'Allows the user to trigger massive or specific ETL data sync')
ON CONFLICT (name) DO NOTHING;

-- Insert basic roles
INSERT INTO roles (name) VALUES
   ('ADMIN'),
   ('USER')
ON CONFLICT (name) DO NOTHING;

-- Map capabilities to roles
-- ADMIN gets both VIEW_METRICS and TRIGGER_ETL
INSERT INTO roles_capabilities (role_id, capability_id)
SELECT r.id, c.id
FROM roles r, capabilities c
WHERE r.name = 'ADMIN' AND c.name IN ('VIEW_METRICS', 'TRIGGER_ETL')
ON CONFLICT DO NOTHING;

-- USER gets only VIEW_METRICS
INSERT INTO roles_capabilities (role_id, capability_id)
SELECT r.id, c.id
FROM roles r, capabilities c
WHERE r.name = 'USER' AND c.name = 'VIEW_METRICS'
ON CONFLICT DO NOTHING;