package com.worldmetrics.backend.service;

import com.worldmetrics.backend.model.Country;
import com.worldmetrics.backend.model.Indicator;
import com.worldmetrics.backend.repository.CountryRepository;
import com.worldmetrics.backend.repository.IndicatorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultMassiveSyncService implements MassiveSyncService {

    private final CountryRepository countryRepository;
    private final IndicatorRepository indicatorRepository;
    private final WorldBankDataService worldBankDataService;

    @Override
    public void syncAllData(String yearRange) {
        log.info("Starting massive data sync for all countries and indicators asynchronously...");

        List<Country> countries = countryRepository.findAll();
        List<Indicator> indicators = indicatorRepository.findAll();

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            List<CompletableFuture<Void>> futures = new ArrayList<>();

            for (Country country : countries) {
                for (Indicator indicator : indicators) {

                    CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                        try {
                            log.info("Syncing - Country: {}, Indicator: {}", country.getIsoCode(), indicator.getApiCode());
                            worldBankDataService.fetchAndSaveData(country.getIsoCode(), indicator.getApiCode(), yearRange);
                        } catch (Exception e) {
                            log.error("Failed to sync Country: {}, Indicator: {} - Error: {}",
                                    country.getIsoCode(), indicator.getApiCode(), e.getMessage());
                        }
                    }, executor);

                    futures.add(future);
                }
            }

            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        } catch (Exception e) {
            log.error("Error during massive sync orchestration", e);
        }

        log.info("Massive data sync completed successfully!");
    }
}