package com.worldmetrics.backend.repository;

import com.worldmetrics.backend.model.Country;
import com.worldmetrics.backend.model.Indicator;
import com.worldmetrics.backend.model.MetricValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricValueRepository extends JpaRepository<MetricValue, Integer> {

    List<MetricValue> findByCountryAndIndicatorAndYearIn(Country country, Indicator indicator, List<Integer> years);
    List<MetricValue> findByCountryAndIndicatorOrderByYearAsc(Country country, Indicator indicator);
}
