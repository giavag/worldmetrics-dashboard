package com.worldmetrics.backend.dto;

/**
 * A generic DTO for returning dimension items like Countries or Indicators
 * to populate frontend dropdowns.
 */
public record DimensionItemDTO(
        String code,
        String name
) {
}
