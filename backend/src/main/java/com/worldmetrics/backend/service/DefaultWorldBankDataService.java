package com.worldmetrics.backend.service;

import com.worldmetrics.backend.core.exceptions.EntityNotFoundException;
import com.worldmetrics.backend.core.exceptions.ExternalApiException;
import com.worldmetrics.backend.dto.WorldBankDataDto;
import com.worldmetrics.backend.mapper.MetricValueMapper;
import com.worldmetrics.backend.model.Country;
import com.worldmetrics.backend.model.Indicator;
import com.worldmetrics.backend.model.MetricValue;
import com.worldmetrics.backend.repository.CountryRepository;
import com.worldmetrics.backend.repository.IndicatorRepository;
import com.worldmetrics.backend.repository.MetricValueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class DefaultWorldBankDataService implements WorldBankDataService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final CountryRepository countryRepository;
    private final IndicatorRepository indicatorRepository;
    private final MetricValueRepository metricValueRepository;
    private final MetricValueMapper metricValueMapper;

    @Override
    @Transactional
    public void fetchAndSaveData(String countryIsoCode, String indicatorId, String year) {
        log.info("Starting ETL process...");
        List<WorldBankDataDto> fetchedData = fetchData(countryIsoCode, indicatorId, year);

        if (!fetchedData.isEmpty()) {
            saveData(fetchedData);
        }
        log.info("ETL process completed successfully!");
    }

    @Override
    public List<WorldBankDataDto> fetchData(String countryIsoCode, String indicatorId, String year) {
        log.debug("Fetching data from API for Country: {}, Indicator: {}, Year: {}",
                countryIsoCode, indicatorId, year);

        JsonNode responseNode = restClient.get()
                .uri("/country/{country}/indicator/{indicator}?format=json&date={date}&per_page=1000",
                        countryIsoCode, indicatorId, year)
                .retrieve()
                .body(JsonNode.class);

        if (responseNode == null || !responseNode.has(1)) {
            throw new ExternalApiException("World Bank API returned an invalid JSON structure.");
        }

        JsonNode dataArray = responseNode.get(1);

        return objectMapper.convertValue(
                dataArray,
                new TypeReference<>() {}
        );
    }

    @Override
    public void saveData(List<WorldBankDataDto> data) {
        log.debug("Processing {} records retrieved from API...", data.size());

        // 1. Collect only valid DTOs and years (ignoring null values)
        List<WorldBankDataDto> validDtos = new ArrayList<>();
        List<Integer> yearsToProcess = new ArrayList<>();

        for (WorldBankDataDto dto : data) {
            if (dto.value() != null && dto.date() != null) {
                validDtos.add(dto);
                yearsToProcess.add(Integer.valueOf(dto.date()));
            }
        }

        if (validDtos.isEmpty()) {
            log.warn("No valid records found to save (all retrieved values were null).");
            return;
        }

        // 2. Since all DTOs in this specific request belong to the same Country & Indicator,
        // we fetch the Entities only once (using the first DTO) to minimize DB calls.
        WorldBankDataDto firstDto = validDtos.get(0);

        Country country = countryRepository.findByIsoCode(firstDto.countryIso3Code())
                .orElseThrow(() -> new EntityNotFoundException(Country.class, firstDto.countryIso3Code()));

        Indicator indicator = indicatorRepository.findByApiCode(firstDto.indicator().id())
                .orElseThrow(() -> new EntityNotFoundException(Indicator.class, firstDto.indicator().id()));

        // 3. Fetch existing records from the database for these specific years
        List<MetricValue> existingRecords = metricValueRepository
                .findByCountryAndIndicatorAndYearIn(country, indicator, yearsToProcess);

        // 4. Create a Map (Year -> MetricValue) for O(1) instant lookup
        Map<Integer, MetricValue> existingRecordsMap = new HashMap<>();
        for (MetricValue mv : existingRecords) {
            existingRecordsMap.put(mv.getYear(), mv);
        }

        List<MetricValue> metricsToSave = new ArrayList<>();

        // 5. The Upsert loop (Update or Insert)
        for (WorldBankDataDto dto : validDtos) {
            MetricValue metricValue;
            Integer dtoYear = Integer.valueOf(dto.date());

            if (existingRecordsMap.containsKey(dtoYear)) {
                // Record already exists: UPDATE the value (handling data revisions)
                metricValue = existingRecordsMap.get(dtoYear);
                metricValue.setValue(dto.value());
                log.trace("Updating existing record for year: {}", dto.date());
            } else {
                // Record does not exist: INSERT via our Mapper
                metricValue = metricValueMapper.mapToEntity(dto, country, indicator);
                log.trace("Creating new record for year: {}", dto.date());
            }

            metricsToSave.add(metricValue);
        }

        // 6. Bulk save operation
        metricValueRepository.saveAll(metricsToSave);
        log.info("Successfully upserted {} metric values to the database.", metricsToSave.size());
    }
}