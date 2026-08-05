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

        Map<String, Country> countryCache = new HashMap<>();
        Map<String, Indicator> indicatorCache = new HashMap<>();

        List<MetricValue> metricsToSave = new ArrayList<>();

        for (WorldBankDataDto dto : data) {

            if (dto.value() == null) {
                log.trace("Skipping record with null value for year: {}", dto.date());
                continue;
            }

            // Get from cache, or fetch from DB and put in cache if not exists
            Country country = countryCache.computeIfAbsent(dto.countryIso3Code(), isoCode ->
                    countryRepository.findByIsoCode(isoCode)
                            .orElseThrow(() -> new EntityNotFoundException(Country.class, isoCode))
            );

            Indicator indicator = indicatorCache.computeIfAbsent(dto.indicator().id(), apiCode ->
                    indicatorRepository.findByApiCode(apiCode)
                            .orElseThrow(() -> new EntityNotFoundException(Indicator.class, apiCode))
            );

            MetricValue metricValue = metricValueMapper.mapToEntity(dto, country, indicator);
            metricsToSave.add(metricValue);
        }

        if (!metricsToSave.isEmpty()) {
            metricValueRepository.saveAll(metricsToSave);
            log.info("Successfully saved {} valid metric values to the database.", metricsToSave.size());
        } else {
            log.warn("No valid records found to save (all retrieved values were null).");
        }
    }
}