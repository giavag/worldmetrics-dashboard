package com.worldmetrics.backend.repository;

import com.worldmetrics.backend.model.SavedWidget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedWidgetRepository extends JpaRepository<SavedWidget, Long> {
    List<SavedWidget> findAllByUserId(Long userId);
}