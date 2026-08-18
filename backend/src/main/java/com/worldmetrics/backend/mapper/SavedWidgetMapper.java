package com.worldmetrics.backend.mapper;

import com.worldmetrics.backend.dto.SavedWidgetResponseDTO;
import com.worldmetrics.backend.model.SavedWidget;
import org.springframework.stereotype.Component;

@Component
public class SavedWidgetMapper {

    public SavedWidgetResponseDTO toReadOnlyDTO(SavedWidget widget) {
        if (widget == null) {
            return null;
        }

        return new SavedWidgetResponseDTO(
                widget.getId(),
                widget.getTitle(),
                widget.getCountries(),
                widget.getIndicatorCode(),
                widget.getChartType()
        );
    }
}