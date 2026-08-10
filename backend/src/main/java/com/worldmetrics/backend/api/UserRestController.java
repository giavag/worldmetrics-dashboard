package com.worldmetrics.backend.api;

import com.worldmetrics.backend.dto.UserReadOnlyDTO;
import com.worldmetrics.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
