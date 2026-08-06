package com.worldmetrics.backend.api;

import com.worldmetrics.backend.dto.MetricSeriesResponseDto;
import com.worldmetrics.backend.service.WorldBankDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/metrics")
@RequiredArgsConstructor
@Slf4j
public class MetricServingRestController {

    private final WorldBankDataService worldBankDataService;

    @GetMapping
    public ResponseEntity<MetricSeriesResponseDto> getMetrics(
            @RequestParam String country,
            @RequestParam String indicator) {

        log.info("Received REST request to fetch metrics for Country: {}, Indicator: {}", country, indicator);
        MetricSeriesResponseDto response = worldBankDataService.getMetricsSeries(country, indicator);
        return ResponseEntity.ok(response);
    }
}
