package com.worldmetrics.backend.mapper;

import com.worldmetrics.backend.dto.SavedWidgetRequestDTO;
import com.worldmetrics.backend.dto.SavedWidgetResponseDTO;
import com.worldmetrics.backend.model.SavedWidget;
import com.worldmetrics.backend.model.User;
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
                widget.getChartType(),
                widget.getStartYear(),
                widget.getEndYear()
        );
    }

    public SavedWidget toEntity(SavedWidgetRequestDTO dto, User user) {
        if (dto == null || user == null) {
            return null;
        }

        SavedWidget widget = new SavedWidget();
        widget.setUser(user);
        widget.setTitle(dto.title());
        widget.setCountries(dto.countries());
        widget.setIndicatorCode(dto.indicatorCode());
        widget.setChartType(dto.chartType());
        widget.setStartYear(dto.startYear());
        widget.setEndYear(dto.endYear());

        return widget;
    }
}