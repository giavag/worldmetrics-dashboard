package com.worldmetrics.backend.service;

import com.worldmetrics.backend.core.exceptions.EntityNotFoundException;
import com.worldmetrics.backend.core.exceptions.UnauthorizedActionException;
import com.worldmetrics.backend.dto.SavedWidgetRequestDTO;
import com.worldmetrics.backend.dto.SavedWidgetResponseDTO;
import com.worldmetrics.backend.mapper.SavedWidgetMapper;
import com.worldmetrics.backend.model.SavedWidget;
import com.worldmetrics.backend.model.User;
import com.worldmetrics.backend.repository.SavedWidgetRepository;
import com.worldmetrics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DefaultSavedWidgetService implements SavedWidgetService {

    private final SavedWidgetRepository savedWidgetRepository;
    private final UserRepository userRepository;
    private final SavedWidgetMapper savedWidgetMapper;

    @Override
    @Transactional
    public SavedWidgetResponseDTO saveWidget(String userEmail, SavedWidgetRequestDTO requestDto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        SavedWidget widget = new SavedWidget();
        widget.setUser(user);

        widget.setTitle(requestDto.title());
        widget.setCountries(requestDto.countries());
        widget.setIndicatorCode(requestDto.indicatorCode());
        widget.setChartType(requestDto.chartType());

        SavedWidget savedWidget = savedWidgetRepository.save(widget);

        return savedWidgetMapper.toReadOnlyDTO(savedWidget);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavedWidgetResponseDTO> getUserWidgets(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        return savedWidgetRepository.findAllByUserId(user.getId())
                .stream()
                .map(savedWidgetMapper::toReadOnlyDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteWidget(String userEmail, Long widgetId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        SavedWidget widget = savedWidgetRepository.findById(widgetId)
                .orElseThrow(() -> new EntityNotFoundException("Widget not found with ID: " + widgetId));

        if (!widget.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("Unauthorized: You do not have permission to delete this widget");
        }

        savedWidgetRepository.delete(widget);
    }
}