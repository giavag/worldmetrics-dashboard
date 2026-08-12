package com.worldmetrics.backend.core.exceptions;

import com.worldmetrics.backend.dto.ErrorResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles validation errors triggered by @Valid (e.g., password pattern or blank email)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Extract field names and default messages from the validation errors
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation constraints violated: {}", errors);
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST); // HTTP 400
    }

    // Handles the custom exception when a user tries to register with an existing email
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        log.warn("Registration conflict: {}", ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO("USER_ALREADY_EXISTS", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT); // HTTP 409
    }

    // Handles the custom exception when a required role is missing from the database
    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleRoleNotFound(RoleNotFoundException ex) {
        log.error("System configuration error: {}", ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO("ROLE_NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // HTTP 500
    }

    // Fallback handler for any other unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGenericException(Exception ex) {
        log.error("An unexpected error occurred during processing: ", ex);

        ErrorResponseDTO error = new ErrorResponseDTO("INTERNAL_SERVER_ERROR", "An unexpected error occurred.");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // HTTP 500
    }

    // Handles the custom exception when an entity is not found
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleEntityNotFound(EntityNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());

        ErrorResponseDTO error = new ErrorResponseDTO("RESOURCE_NOT_FOUND", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND); // HTTP 404
    }
}
