-- =========================
-- Dimension Table: Countries
-- =========================
CREATE TABLE countries (
   id SERIAL,
   iso_code VARCHAR(3) NOT NULL,
   name VARCHAR(100) NOT NULL,
   region VARCHAR(100),

   CONSTRAINT pk_countries PRIMARY KEY (id),
   CONSTRAINT uk_countries_iso UNIQUE (iso_code)
);

-- =========================
-- Dimension Table: Indicators
-- =========================
CREATE TABLE indicators (
    id SERIAL,
    api_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,

    CONSTRAINT pk_indicators PRIMARY KEY (id),
    CONSTRAINT uk_indicators_api_code UNIQUE (api_code)
);

-- =========================
-- Fact Table: Metric Values
-- =========================
CREATE TABLE metric_values (
   id SERIAL,
   country_id INTEGER NOT NULL,
   indicator_id INTEGER NOT NULL,
   year INTEGER NOT NULL,
   value NUMERIC,

   CONSTRAINT pk_metric_values PRIMARY KEY (id),

   CONSTRAINT fk_metrics_country
       FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,

   CONSTRAINT fk_metrics_indicator
       FOREIGN KEY (indicator_id) REFERENCES indicators(id) ON DELETE CASCADE,

-- Enforce uniqueness to prevent duplicate records for the same metric in a given year
   CONSTRAINT uk_metrics_country_indicator_year UNIQUE (country_id, indicator_id, year)
);

-- =========================
-- Indexes for Query Performance Optimization
-- =========================
CREATE INDEX idx_metrics_country_id ON metric_values (country_id);
CREATE INDEX idx_metrics_indicator_id ON metric_values (indicator_id);
CREATE INDEX idx_metrics_year ON metric_values (year);