package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.MetricSeriesResponseDto;
import com.worldmetrics.backend.dto.WorldBankDataDto;

import java.util.List;

public interface WorldBankDataService {

    /**
     * Orchestrator: Fetches data from API and immediately saves it.
     */
    void fetchAndSaveData(String countryIsoCode, String indicatorId, String year);

    /**
     * Extracts and transforms raw data from the World Bank API into manageable DTOs.
     *
     * @param countryIsoCode The 3-letter ISO code of the country (e.g., "GRC")
     * @param indicatorId    The API code of the indicator (e.g., "NY.GDP.MKTP.CD")
     * @param year           The target year or time range (e.g., "2000:2023" or "2023")
     * @return A list of WorldBankDataDto containing the extracted metric values
     */
    List<WorldBankDataDto> fetchData(String countryIsoCode, String indicatorId, String year);

    /**
     * Loads the transformed DTOs into the database.
     */
    void saveData(List<WorldBankDataDto> data);

    /**
     * Retrieves chronological time-series data for a specific country and indicator,
     * mapped into a frontend-ready DTO.
     *
     * @param countryIsoCode   The 3-letter ISO code of the country (e.g., "GRC")
     * @param indicatorApiCode The API code of the indicator (e.g., "NY.GDP.MKTP.CD")
     * @return A MetricSeriesResponseDto containing metadata and sorted data points
     */
    MetricSeriesResponseDto getMetricsSeries(String countryIsoCode, String indicatorApiCode);
}
