package com.worldmetrics.backend.api;

import com.worldmetrics.backend.dto.DimensionItemDTO;
import com.worldmetrics.backend.service.DimensionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for serving dimension data (Countries, Indicators)
 * used to populate frontend filters dynamically.
 */
@RestController
@RequestMapping("/api/v1/dimensions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dimensions", description = "Endpoints for retrieving available countries and indicators")
public class DimensionRestController {

    private final DimensionService dimensionService;

    @GetMapping("/countries")
    public ResponseEntity<List<DimensionItemDTO>> getCountries() {
        log.info("REST request to fetch all countries for dropdowns");
        return ResponseEntity.ok(dimensionService.getAllCountries());
    }

    @GetMapping("/indicators")
    public ResponseEntity<List<DimensionItemDTO>> getIndicators() {
        log.info("REST request to fetch all indicators for dropdowns");
        return ResponseEntity.ok(dimensionService.getAllIndicators());
    }
}