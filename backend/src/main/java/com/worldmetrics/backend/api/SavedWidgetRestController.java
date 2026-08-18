package com.worldmetrics.backend.api;

import com.worldmetrics.backend.dto.SavedWidgetRequestDTO;
import com.worldmetrics.backend.dto.SavedWidgetResponseDTO;
import com.worldmetrics.backend.service.SavedWidgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/widgets")
@RequiredArgsConstructor
public class SavedWidgetRestController {

    private final SavedWidgetService savedWidgetService;

    @PostMapping
    public ResponseEntity<SavedWidgetResponseDTO> saveWidget(
            Authentication authentication,
            @Valid @RequestBody SavedWidgetRequestDTO requestDto) {

        // Extract the email of the currently authenticated user from the JWT
        String userEmail = authentication.getName();
        log.info("Received request to save widget for user: {}", userEmail);

        SavedWidgetResponseDTO savedWidget = savedWidgetService.saveWidget(userEmail, requestDto);
        return new ResponseEntity<>(savedWidget, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SavedWidgetResponseDTO>> getUserWidgets(Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("Fetching saved widgets for user: {}", userEmail);

        List<SavedWidgetResponseDTO> widgets = savedWidgetService.getUserWidgets(userEmail);
        return ResponseEntity.ok(widgets);
    }

    @DeleteMapping("/{widgetId}")
    public ResponseEntity<Void> deleteWidget(
            Authentication authentication,
            @PathVariable Long widgetId) {

        String userEmail = authentication.getName();
        log.info("Received request to delete widget ID: {} for user: {}", widgetId, userEmail);

        savedWidgetService.deleteWidget(userEmail, widgetId);

        // Return 204 No Content for successful deletion
        return ResponseEntity.noContent().build();
    }
}