package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.DimensionItemDTO;
import java.util.List;

/**
 * Service interface for dimension data retrieval.
 */
public interface DimensionService {

    List<DimensionItemDTO> getAllCountries();

    List<DimensionItemDTO> getAllIndicators();
}