package com.worldmetrics.backend.repository;

import com.worldmetrics.backend.model.MetricValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetricValueRepository extends JpaRepository<MetricValue, Integer> {
}
