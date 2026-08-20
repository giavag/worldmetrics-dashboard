package com.worldmetrics.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SavedWidgetRequestDTO(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Countries are required")
        String countries,

        @NotBlank(message = "Indicator code is required")
        String indicatorCode,

        @NotBlank(message = "Chart type is required")
        String chartType,

        @NotNull(message = "Start year is required")
        Integer startYear,

        @NotNull(message = "End year is required")
        Integer endYear
) {}