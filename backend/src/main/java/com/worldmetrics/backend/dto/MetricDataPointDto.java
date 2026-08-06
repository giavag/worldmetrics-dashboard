package com.worldmetrics.backend.dto;

import java.math.BigDecimal;

public record MetricDataPointDto(
        String year,
        BigDecimal value
) {
}
