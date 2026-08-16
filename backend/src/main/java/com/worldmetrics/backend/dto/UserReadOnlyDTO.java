package com.worldmetrics.backend.dto;

import java.util.UUID;

public record UserReadOnlyDTO(
        UUID uuid,
        String firstName,
        String lastName,
        String email,
        String role
) {
}
