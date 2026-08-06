package com.worldmetrics.backend.dto;

import java.util.List;

public record MetricSeriesResponseDto(
        String countryIsoCode,
        String countryName,
        String indicatorCode,
        String indicatorName,
        List<MetricDataPointDto> data
) {
}
