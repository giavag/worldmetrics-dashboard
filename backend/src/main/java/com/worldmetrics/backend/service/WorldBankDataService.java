package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.WorldBankDataDto;

import java.util.List;

public interface WorldBankDataService {

    /**
     * Orchestrator: Fetches data from API and immediately saves it.
     */
    void fetchAndSaveData(String countryIsoCode, String indicatorId, String year);

    /**
     * Extracts and transforms data from the World Bank API.
     */
    List<WorldBankDataDto> fetchData(String countryIsoCode, String indicatorId, String year);

    /**
     * Loads the transformed DTOs into the database.
     */
    void saveData(List<WorldBankDataDto> data);
}
