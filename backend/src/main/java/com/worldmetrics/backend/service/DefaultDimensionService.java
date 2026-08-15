package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.DimensionItemDTO;
import com.worldmetrics.backend.repository.CountryRepository;
import com.worldmetrics.backend.repository.IndicatorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultDimensionService implements DimensionService {

    private final CountryRepository countryRepository;
    private final IndicatorRepository indicatorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DimensionItemDTO> getAllCountries() {
        log.debug("Fetching all countries from the database");
        return countryRepository.findAll().stream()
                .map(country -> new DimensionItemDTO(country.getIsoCode(), country.getName()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DimensionItemDTO> getAllIndicators() {
        log.debug("Fetching all indicators from the database");
        return indicatorRepository.findAll().stream()
                .map(indicator -> new DimensionItemDTO(indicator.getApiCode(), indicator.getName()))
                .toList();
    }
}