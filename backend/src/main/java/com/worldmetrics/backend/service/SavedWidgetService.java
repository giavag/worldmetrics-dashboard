package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.SavedWidgetRequestDTO;
import com.worldmetrics.backend.dto.SavedWidgetResponseDTO;

import java.util.List;

public interface SavedWidgetService {

    SavedWidgetResponseDTO saveWidget(String userEmail, SavedWidgetRequestDTO requestDto);

    List<SavedWidgetResponseDTO> getUserWidgets(String userEmail);

    void deleteWidget(String userEmail, Long widgetId);
}