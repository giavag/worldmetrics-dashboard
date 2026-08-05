-- =====================================================================
-- Seeding Dimension Table: indicators
-- Using ON CONFLICT to prevent errors if records already exist
-- =====================================================================
INSERT INTO indicators (api_code, name, description) VALUES
    ('NY.GDP.MKTP.CD', 'GDP (current US$)', 'Total Gross Domestic Product of the country in current US dollars.'),
    ('NY.GDP.PCAP.CD', 'GDP per capita (current US$)', 'Gross Domestic Product per capita in current US dollars.'),
    ('SP.POP.TOTL', 'Population, total', 'Total population of the country.'),
    ('FP.CPI.TOTL.ZG', 'Inflation, consumer prices (annual %)', 'Annual inflation rate based on the consumer price index.'),
    ('SL.UEM.TOTL.ZS', 'Unemployment, total (% of total labor force)', 'Unemployment rate as a percentage of the total labor force.'),
    ('SP.DYN.LE00.IN', 'Life expectancy at birth, total (years)', 'Total life expectancy at birth in years.'),
    ('EN.ATM.CO2E.KT', 'CO2 emissions (kt)', 'Total carbon dioxide emissions in kilotons.'),
    ('SE.XPD.TOTL.GD.ZS', 'Government expenditure on education (% of GDP)', 'General government expenditure on education as a percentage of GDP.'),
    ('IT.NET.USER.ZS', 'Individuals using the Internet (% of population)', 'Percentage of the population with internet access.'),
    ('SH.MED.PHYS.ZS', 'Physicians (per 1,000 people)', 'Number of medical doctors per 1,000 people.')
ON CONFLICT (api_code) DO NOTHING;

-- =====================================================================
-- Seeding Dimension Table: countries
-- =====================================================================
INSERT INTO countries (iso_code, name, region) VALUES

   -- Europe
   ('GRC', 'Greece', 'Europe & Central Asia'),
   ('CYP', 'Cyprus', 'Europe & Central Asia'),
   ('DEU', 'Germany', 'Europe & Central Asia'),
   ('FRA', 'France', 'Europe & Central Asia'),
   ('ITA', 'Italy', 'Europe & Central Asia'),
   ('ESP', 'Spain', 'Europe & Central Asia'),
   ('GBR', 'United Kingdom', 'Europe & Central Asia'),
   ('SWE', 'Sweden', 'Europe & Central Asia'),
   ('POL', 'Poland', 'Europe & Central Asia'),
   ('CHE', 'Switzerland', 'Europe & Central Asia'),

   -- North & South America
   ('USA', 'United States', 'North America'),
   ('CAN', 'Canada', 'North America'),
   ('MEX', 'Mexico', 'Latin America & Caribbean'),
   ('BRA', 'Brazil', 'Latin America & Caribbean'),
   ('ARG', 'Argentina', 'Latin America & Caribbean'),

   -- Asia & Oceania
   ('CHN', 'China', 'East Asia & Pacific'),
   ('JPN', 'Japan', 'East Asia & Pacific'),
   ('IND', 'India', 'South Asia'),
   ('KOR', 'South Korea', 'East Asia & Pacific'),
   ('AUS', 'Australia', 'East Asia & Pacific'),
   ('NZL', 'New Zealand', 'East Asia & Pacific'),
   ('SGP', 'Singapore', 'East Asia & Pacific'),

   -- Middle East & Africa
   ('ZAF', 'South Africa', 'Sub-Saharan Africa'),
   ('NGA', 'Nigeria', 'Sub-Saharan Africa'),
   ('EGY', 'Egypt, Arab Rep.', 'Middle East & North Africa'),
   ('SAU', 'Saudi Arabia', 'Middle East & North Africa'),
   ('ARE', 'United Arab Emirates', 'Middle East & North Africa'),
   ('ISR', 'Israel', 'Middle East & North Africa'),
   ('TUR', 'Turkiye', 'Europe & Central Asia'),
   ('KEN', 'Kenya', 'Sub-Saharan Africa')
ON CONFLICT (iso_code) DO NOTHING;