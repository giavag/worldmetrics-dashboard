package com.worldmetrics.backend.service;

import com.worldmetrics.backend.core.exceptions.EntityNotFoundException;
import com.worldmetrics.backend.core.exceptions.ExternalApiException;
import com.worldmetrics.backend.dto.WorldBankDataDto;
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

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DefaultWorldBankDataService implements WorldBankDataService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final CountryRepository countryRepository;
    private final IndicatorRepository indicatorRepository;
    private final MetricValueRepository metricValueRepository;

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
                .uri("/country/{country}/indicator/{indicator}?format=json&date={date}",
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
        log.debug("Saving {} records to the database...", data.size());

        for (WorldBankDataDto dto : data) {

            Country country = countryRepository.findByIsoCode(dto.countryIso3Code())
                    .orElseThrow(() -> new EntityNotFoundException(
                            Country.class,
                            dto.countryIso3Code())
                    );

            Indicator indicator = indicatorRepository.findById(dto.indicator().id())
                    .orElseThrow(() -> new EntityNotFoundException(
                            Indicator.class,
                            dto.indicator().id())
                    );

            MetricValue metricValue = new MetricValue();
            metricValue.setCountry(country);
            metricValue.setIndicator(indicator);
            metricValue.setYear(Integer.parseInt(dto.date()));
            metricValue.setValue(dto.value());

            metricValueRepository.save(metricValue);
        }

    }
}
