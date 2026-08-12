package com.worldmetrics.backend.dto;

import java.util.UUID;

public record UserReadOnlyDTO(
        UUID uuid,
        String email,
        String role
) {
}
