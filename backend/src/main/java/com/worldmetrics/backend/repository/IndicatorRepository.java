package com.worldmetrics.backend.repository;

import com.worldmetrics.backend.model.Indicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IndicatorRepository extends JpaRepository<Indicator, Integer> {

    Optional<Indicator> findByApiCode(String apiCode);
}
