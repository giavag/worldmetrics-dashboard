-- =====================================================================
-- Seeding Dimension Table: indicators
-- Using ON CONFLICT to prevent errors if records already exist
-- =====================================================================
INSERT INTO indicators (api_code, name, description) VALUES
     ('NY.GDP.MKTP.CD', 'GDP (current US$)', 'Total Gross Domestic Product of the country in current US dollars.'),
     ('SP.POP.TOTL', 'Population, total', 'Total population of the country.'),
     ('FP.CPI.TOTL.ZG', 'Inflation, consumer prices (annual %)', 'Annual inflation rate based on the consumer price index.'),
     ('SL.UEM.TOTL.ZS', 'Unemployment, total (% of total labor force)', 'Unemployment rate as a percentage of the total labor force.')
ON CONFLICT (api_code) DO NOTHING;

-- =====================================================================
-- Seeding Dimension Table: countries
-- =====================================================================
INSERT INTO countries (iso_code, name, region) VALUES
     ('GRC', 'Greece', 'Europe & Central Asia'),
     ('DEU', 'Germany', 'Europe & Central Asia'),
     ('USA', 'United States', 'North America'),
     ('BRA', 'Brazil', 'Latin America & Caribbean'),
     ('CHN', 'China', 'East Asia & Pacific')
ON CONFLICT (iso_code) DO NOTHING;