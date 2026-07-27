package com.worldmetrics.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
    name = "metric_values",
    uniqueConstraints = {
        @UniqueConstraint(
                name = "uk_metrics_country_indicator_year",
                columnNames = {"country_id", "indicator_id", "year"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MetricValue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Many-to-One relationship mapping to the countries table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    // Many-to-One relationship mapping to the indicators table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "indicator_id", nullable = false)
    private Indicator indicator;

    @Column(nullable = false)
    private Integer year;

    // Using BigDecimal to map the NUMERIC database type and preserve exact precision
    @Column(name = "value")
    private BigDecimal value;
}
