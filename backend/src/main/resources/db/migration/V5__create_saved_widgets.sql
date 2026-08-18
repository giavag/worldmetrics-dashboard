-- =====================================================================
-- Migration V5: Create Saved Widgets Table for "My Dashboards" feature
-- =====================================================================

CREATE TABLE saved_widgets (
   id BIGSERIAL,
   user_id BIGINT NOT NULL,
   title VARCHAR(255) NOT NULL,
   countries TEXT NOT NULL,
   indicator_code VARCHAR(50) NOT NULL,
   chart_type VARCHAR(50) NOT NULL,

   CONSTRAINT pk_saved_widgets PRIMARY KEY (id),

-- Foreign key to users table with CASCADE delete
   CONSTRAINT fk_saved_widgets_user
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- Indexes for Query Performance
-- =========================
CREATE INDEX idx_saved_widgets_user_id ON saved_widgets (user_id);