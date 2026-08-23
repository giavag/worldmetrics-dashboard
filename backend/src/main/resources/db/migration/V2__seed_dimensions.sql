-- =====================================================================
-- Seeding Dimension Table: indicators
-- Using ON CONFLICT to prevent errors if records already exist
-- =====================================================================
INSERT INTO indicators (api_code, name, description) VALUES
    ('NY.GDP.MKTP.CD', 'GDP (current US$)', 'Total Gross Domestic Product of the country in current US dollars.'),
    ('SP.POP.TOTL', 'Population, total', 'Total population of the country.'),
    ('FP.CPI.TOTL.ZG', 'Inflation, consumer prices (annual %)', 'Annual inflation rate based on the consumer price index.'),
    ('SL.UEM.TOTL.ZS', 'Unemployment, total (% of total labor force)', 'Unemployment rate as a percentage of the total labor force.'),
    ('NY.GDP.PCAP.CD', 'GDP per capita (current US$)', 'Gross domestic product divided by midyear population.'),
    ('SP.DYN.LE00.IN', 'Life expectancy at birth (years)', 'Indicates the number of years a newborn infant would live.'),
    ('SE.XPD.TOTL.GD.ZS', 'Government expenditure on education (% of GDP)', 'General government expenditure on education as a percentage of GDP.')
ON CONFLICT (api_code) DO NOTHING;

-- =====================================================================
-- Seeding Dimension Table: countries
-- =====================================================================
INSERT INTO countries (iso_code, name, region) VALUES
   -- Europe & Central Asia
   ('GRC', 'Greece', 'Europe & Central Asia'),
   ('DEU', 'Germany', 'Europe & Central Asia'),
   ('SVK', 'Slovakia', 'Europe & Central Asia'),
   ('FRA', 'France', 'Europe & Central Asia'),
   ('ITA', 'Italy', 'Europe & Central Asia'),
   ('GBR', 'United Kingdom', 'Europe & Central Asia'),

   -- North America
   ('USA', 'United States', 'North America'),
   ('CAN', 'Canada', 'North America'),

   -- Latin America & Caribbean
   ('BRA', 'Brazil', 'Latin America & Caribbean'),
   ('MEX', 'Mexico', 'Latin America & Caribbean'),
   ('ARG', 'Argentina', 'Latin America & Caribbean'),

   -- East Asia & Pacific
   ('CHN', 'China', 'East Asia & Pacific'),
   ('JPN', 'Japan', 'East Asia & Pacific'),
   ('KOR', 'South Korea', 'East Asia & Pacific'),
   ('AUS', 'Australia', 'East Asia & Pacific'),

   -- South Asia
   ('IND', 'India', 'South Asia'),

   -- Sub-Saharan Africa
   ('ZAF', 'South Africa', 'Sub-Saharan Africa'),

   -- Middle East & North Africa
   ('EGY', 'Egypt', 'Middle East & North Africa'),
   ('ARE', 'United Arab Emirates', 'Middle East & North Africa')
ON CONFLICT (iso_code) DO NOTHING;