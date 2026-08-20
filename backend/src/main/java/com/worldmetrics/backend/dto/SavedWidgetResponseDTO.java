package com.worldmetrics.backend.dto;

public record SavedWidgetResponseDTO(
        Long id,
        String title,
        String countries,
        String indicatorCode,
        String chartType,
        Integer startYear,
        Integer endYear
) {}