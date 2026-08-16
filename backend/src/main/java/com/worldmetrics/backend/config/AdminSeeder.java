package com.worldmetrics.backend.config;

import com.worldmetrics.backend.dto.RegisterRequestDTO;
import com.worldmetrics.backend.model.Role;
import com.worldmetrics.backend.model.User;
import com.worldmetrics.backend.core.exceptions.RoleNotFoundException;
import com.worldmetrics.backend.mapper.UserMapper;
import com.worldmetrics.backend.repository.RoleRepository;
import com.worldmetrics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Value("${application.admin.email}")
    private String adminEmail;

    @Value("${application.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {

        // Check if the admin user already exists to prevent duplicate entries on restarts
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            log.info("Super Admin not found in database. Initializing setup...");

            // Fetch the ADMIN role
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RoleNotFoundException("ADMIN role not found. Ensure Flyway scripts ran successfully."));

            // Create a DTO to mimic a registration request
            RegisterRequestDTO adminDto = new RegisterRequestDTO("System", "Admin", adminEmail, adminPassword);

            // Encode the password securely
            String encodedPassword = passwordEncoder.encode(adminDto.password());

            // Utilize the UserMapper to convert the DTO and details into a User entity
            User admin = userMapper.toUser(adminDto, encodedPassword, adminRole);

            // Persist the admin user to the database
            userRepository.save(admin);

            log.info("Super Admin user created successfully with email: {}", adminEmail);
        } else {
            log.info("Super Admin user already exists. Skipping initialization.");
        }
    }
}
