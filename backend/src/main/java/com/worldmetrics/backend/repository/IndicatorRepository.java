package com.worldmetrics.backend.repository;

import com.worldmetrics.backend.model.Indicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndicatorRepository extends JpaRepository<Indicator, Integer> {
}
