-- =====================================================================
-- Migration V6: Add year range filters to saved widgets
-- =====================================================================

ALTER TABLE saved_widgets
    ADD COLUMN start_year INTEGER,
    ADD COLUMN end_year INTEGER;