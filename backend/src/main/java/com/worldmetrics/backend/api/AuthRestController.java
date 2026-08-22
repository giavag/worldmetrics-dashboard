package com.worldmetrics.backend.api;

import com.worldmetrics.backend.authentication.AuthenticationService;
import com.worldmetrics.backend.dto.AuthenticationRequestDTO;
import com.worldmetrics.backend.dto.AuthenticationResponseDTO;
import com.worldmetrics.backend.dto.RegisterRequestDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication API", description = "Endpoints for user authentication and token generation")
public class AuthRestController {

    private final AuthenticationService authenticationService;

    @Operation(summary = "User Login", description = "Authenticates a user with email and password, and returns a JWT token.")
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@Valid @RequestBody AuthenticationRequestDTO requestDTO) {

        log.info("Received login request for email: {}", requestDTO.email());

        try {
            AuthenticationResponseDTO response = authenticationService.authenticate(requestDTO);
            log.info("Successfully authenticated user: {}", requestDTO.email());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warn("Failed login attempt for email: {}. Reason: {}", requestDTO.email(), e.getMessage());
            throw e;
        }
    }

    @Operation(summary = "User Registration", description = "Registers a new user with default role USER and returns a JWT token.")
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@Valid @RequestBody RegisterRequestDTO requestDTO) {

        log.info("Received registration request for email: {}", requestDTO.email());

        try {
            AuthenticationResponseDTO response = authenticationService.register(requestDTO);
            log.info("Successfully registered new user: {}", requestDTO.email());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warn("Failed registration attempt for email: {}. Reason: {}", requestDTO.email(), e.getMessage());
            throw e;
        }
    }
}