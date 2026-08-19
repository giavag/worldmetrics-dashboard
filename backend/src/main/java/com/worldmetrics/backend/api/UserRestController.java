package com.worldmetrics.backend.api;

import com.worldmetrics.backend.dto.CreateUserRequestDTO;
import com.worldmetrics.backend.dto.UpdateUserRequestDTO;
import com.worldmetrics.backend.dto.UserReadOnlyDTO;
import com.worldmetrics.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

    @Operation(summary = "Get all users (Paginated)", description = "Retrieves a paginated list of all registered users. Requires ADMIN privileges. Supports page, size, and sort parameters.")
    @ApiResponse(responseCode = "200", description = "Paginated list of users successfully retrieved")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping
    public ResponseEntity<Page<UserReadOnlyDTO>> getAllUsers(
            @PageableDefault(size = 20, sort = "email") Pageable pageable) {

        log.info("REST request to fetch users - Page: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<UserReadOnlyDTO> usersPage = userService.getAllUsers(pageable);
        return ResponseEntity.ok(usersPage);
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

    @Operation(summary = "Update a user", description = "Updates a user's email and role by their UUID. Requires ADMIN privileges.")
    @ApiResponse(responseCode = "200", description = "User successfully updated")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{uuid}")
    public ResponseEntity<UserReadOnlyDTO> updateUser(
            @PathVariable UUID uuid,
            @Valid @RequestBody UpdateUserRequestDTO request) {

        log.info("REST request to update user with UUID: {}", uuid);
        UserReadOnlyDTO updatedUser = userService.updateUser(uuid, request);
        return ResponseEntity.ok(updatedUser);
    }
}
