package com.worldmetrics.backend.service;

import com.worldmetrics.backend.model.Indicator;
import com.worldmetrics.backend.repository.IndicatorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DefaultIndicatorService implements IndicatorService {

    private final IndicatorRepository indicatorRepository;

    @Override
    public List<Indicator> getAllIndicators() {
        log.info("Fetching all indicators from the database...");
        return List.of();
    }
}
