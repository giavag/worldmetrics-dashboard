package com.worldmetrics.backend.service;

public interface MassiveSyncService {

    /**
     * Triggers a massive ETL synchronization for all countries and indicators
     * currently present in the database. Intended for initial data seeding.
     *
     * @param yearRange The target year or time range (e.g., "2000:2023")
     */
    void syncAllData(String yearRange);
}
