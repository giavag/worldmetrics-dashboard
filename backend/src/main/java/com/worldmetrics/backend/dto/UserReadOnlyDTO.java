package com.worldmetrics.backend.dto;

public record UserReadOnlyDTO(
        Long id,
        String email,
        String role
) {
}
