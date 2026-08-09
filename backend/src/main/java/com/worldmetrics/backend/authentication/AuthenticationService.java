package com.worldmetrics.backend.authentication;

import com.worldmetrics.backend.core.exceptions.RoleNotFoundException;
import com.worldmetrics.backend.core.exceptions.UserAlreadyExistsException;
import com.worldmetrics.backend.dto.AuthenticationRequestDTO;
import com.worldmetrics.backend.dto.AuthenticationResponseDTO;
import com.worldmetrics.backend.dto.RegisterRequestDTO;
import com.worldmetrics.backend.mapper.UserMapper;
import com.worldmetrics.backend.model.Role;
import com.worldmetrics.backend.model.User;
import com.worldmetrics.backend.repository.RoleRepository;
import com.worldmetrics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public AuthenticationResponseDTO authenticate(AuthenticationRequestDTO dto) {
        log.info("Attempting authentication for user: {}", dto.email());

        // Authenticate the user credentials via Spring Security's AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password()));

        // Retrieve the authenticated user principal
        User user = (User) authentication.getPrincipal();

        // Generate and return the JWT token
        String token = jwtService.generateToken(authentication.getName(), user.getRole().getName());

        log.info("User {} successfully authenticated.", dto.email());
        return new AuthenticationResponseDTO(token);
    }

    public AuthenticationResponseDTO register(RegisterRequestDTO dto) {
        log.info("Attempting to register new user with email: {}", dto.email());

        // Check if a user with the provided email already exists
        if (userRepository.findByEmail(dto.email()).isPresent()) {
            log.warn("Registration failed: User with email {} already exists.", dto.email());
            throw new UserAlreadyExistsException("User with this email already exists.");
        }

        // Fetch the default role for public registration (Strictly 'USER' for security)
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> {
                    log.error("Registration failed: Default role 'USER' not found in the database.");
                    return new RoleNotFoundException("Default role not found in the database.");
                });

        // Encode the plain-text password securely
        String encodedPassword = passwordEncoder.encode(dto.password());

        // Use the Mapper to convert DTO to Entity
        User user = userMapper.toUser(dto, encodedPassword, role);

        // Persist the new user in the database
        userRepository.save(user);

        log.info("User {} successfully registered with role: USER", dto.email());

        // Automatically authenticate the user post-registration by generating a JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getRole().getName());
        return new AuthenticationResponseDTO(token);
    }
}