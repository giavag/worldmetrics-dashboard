package com.worldmetrics.backend.api;

import com.worldmetrics.backend.service.MassiveSyncService;
import com.worldmetrics.backend.service.WorldBankDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for managing ETL operations related to World Bank data.
 */
@RestController
@RequestMapping("/api/v1/etl")
@RequiredArgsConstructor
@Slf4j
public class WorldBankDataRestController {

    private final WorldBankDataService worldBankDataService;
    private final MassiveSyncService massiveSyncService;

    @PostMapping("/sync")
    public ResponseEntity<String> syncSpecificData(
            @RequestParam String country,
            @RequestParam String indicator,
            @RequestParam String year) {

        log.info("Received REST request to trigger ETL for Country: {}, Indicator: {}, Year: {}",
                country, indicator, year);

        worldBankDataService.fetchAndSaveData(country, indicator, year);

        return ResponseEntity.ok("ETL process completed successfully for country: " + country);
    }

    @PostMapping("/sync-all")
    public ResponseEntity<String> syncAllData(
            @RequestParam(defaultValue = "2000:2025") String yearRange) {

        log.info("Received REST request to trigger massive ETL sync-all for years: {}", yearRange);

        massiveSyncService.syncAllData(yearRange);

        return ResponseEntity.ok("Massive sync process completed successfully");
    }
}
