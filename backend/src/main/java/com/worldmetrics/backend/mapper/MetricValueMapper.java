package com.worldmetrics.backend.mapper;

import com.worldmetrics.backend.dto.WorldBankDataDto;
import com.worldmetrics.backend.model.Country;
import com.worldmetrics.backend.model.Indicator;
import com.worldmetrics.backend.model.MetricValue;
import org.springframework.stereotype.Component;

/**
 * Mapper component responsible for converting DTOs into database Entities.
 * The @Component annotation allows Spring to manage this class and inject it where needed.
 */
@Component
public class MetricValueMapper {

    /**
     * Maps the World Bank API data and existing database entities into a new MetricValue entity.
     *
     * @param dto       The data transfer object containing the year and value.
     * @param country   The resolved Country entity from the database.
     * @param indicator The resolved Indicator entity from the database.
     * @return A populated MetricValue entity ready to be saved.
     */
    public MetricValue mapToEntity(WorldBankDataDto dto, Country country, Indicator indicator) {
        MetricValue metricValue = new MetricValue();

        metricValue.setCountry(country);
        metricValue.setIndicator(indicator);
        metricValue.setYear(Integer.parseInt(dto.date()));
        metricValue.setValue(dto.value());

        return metricValue;
    }
}
