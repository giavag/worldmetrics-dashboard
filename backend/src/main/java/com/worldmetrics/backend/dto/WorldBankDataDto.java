package com.worldmetrics.backend.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * @JsonIgnoreProperties tells Spring to ignore any fields sent by the API
 * that are not defined in this record (e.g., 'obs_status'), preventing mapping errors.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record WorldBankDataDto(

        @JsonProperty("indicator")
        IndicatorDto indicator,

        @JsonProperty("countryiso3code")
        String countryIso3Code,

        @JsonProperty("date")
        String date, // The year of the measurement, e.g. "2022"

        @JsonProperty("value")
        BigDecimal value
) {
    /**
     * Nested record to map the inner JSON Object of the Indicator.
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record IndicatorDto(
            @JsonProperty("id") String id
    ) {}
}
