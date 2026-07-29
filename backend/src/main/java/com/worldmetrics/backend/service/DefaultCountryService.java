package com.worldmetrics.backend.service;

import com.worldmetrics.backend.model.Country;
import com.worldmetrics.backend.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DefaultCountryService implements CountryService {

    private final CountryRepository countryRepository;

    @Override
    public List<Country> getAllCountries() {
        log.info("Fetching all countries from the database...");
        return countryRepository.findAll();
    }
}
