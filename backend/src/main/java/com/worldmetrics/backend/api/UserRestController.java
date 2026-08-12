package com.worldmetrics.backend.api;

import com.worldmetrics.backend.dto.CreateUserRequestDTO;
import com.worldmetrics.backend.dto.UserReadOnlyDTO;
import com.worldmetrics.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management API", description = "Endpoints for managing users in the system")
public class UserRestController {

    private final UserService userService;

    @Operation(summary = "Get all users", description = "Retrieves a list of all registered users. Requires ADMIN privileges.")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    public ResponseEntity<List<UserReadOnlyDTO>> getAllUsers() {

        log.info("REST request to fetch all users");
        List<UserReadOnlyDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Create a new user", description = "Allows an ADMIN to create a new user with a specific role.")
    @ApiResponse(responseCode = "201", description = "User successfully created")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    public ResponseEntity<UserReadOnlyDTO> createUser(@Valid @RequestBody CreateUserRequestDTO request) {
        log.info("REST request to create user: {}", request.email());
        UserReadOnlyDTO createdUser = userService.createUser(request);

        return ResponseEntity.status(201).body(createdUser);
    }

    @Operation(summary = "Delete a user", description = "Soft deletes a user by their UUID. Requires ADMIN privileges.")
    @ApiResponse(responseCode = "204", description = "User successfully deleted")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{uuid}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID uuid) {
        log.info("REST request to delete user with UUID: {}", uuid);
        userService.deleteUser(uuid);
        return ResponseEntity.noContent().build();
    }
}
