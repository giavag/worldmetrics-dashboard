package com.worldmetrics.backend.api;

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
@RequestMapping("/api/etl")
@RequiredArgsConstructor
@Slf4j
public class WorldBankDataRestController {

    private final WorldBankDataService worldBankDataService;

    @PostMapping("/world-bank")
    public ResponseEntity<String> triggerWorldBankEtl(
            @RequestParam String country,
            @RequestParam String indicator,
            @RequestParam String year) {

        log.info("Received REST request to trigger ETL for Country: {}, Indicator: {}, Year: {}",
                country, indicator, year);

        worldBankDataService.fetchAndSaveData(country, indicator, year);

        return ResponseEntity.ok("ETL process completed successfully for country: " + country);
    }

}
