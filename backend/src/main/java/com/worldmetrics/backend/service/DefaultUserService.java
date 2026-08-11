package com.worldmetrics.backend.service;

import com.worldmetrics.backend.core.exceptions.RoleNotFoundException;
import com.worldmetrics.backend.core.exceptions.UserAlreadyExistsException;
import com.worldmetrics.backend.dto.CreateUserRequestDTO;
import com.worldmetrics.backend.dto.UserReadOnlyDTO;
import com.worldmetrics.backend.mapper.UserMapper;
import com.worldmetrics.backend.model.Role;
import com.worldmetrics.backend.model.User;
import com.worldmetrics.backend.repository.RoleRepository;
import com.worldmetrics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DefaultUserService implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserReadOnlyDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toReadOnlyDTO)
                .toList();
    }

    @Override
    @Transactional
    public UserReadOnlyDTO createUser(CreateUserRequestDTO request) {
        log.info("Attempting to create a new user with email: {}", request.email());

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExistsException("User with this email already exists");
        }

        Role role = roleRepository.findByName(request.role().toUpperCase())
                .orElseThrow(() -> new RoleNotFoundException("Role not found: " + request.role()));

        String encodedPassword = passwordEncoder.encode(request.password());
        User newUser = userMapper.toUser(request, encodedPassword, role);

        User savedUser = userRepository.save(newUser);
        log.info("User created successfully with ID: {}", savedUser.getId());

        return userMapper.toReadOnlyDTO(savedUser);
    }
}
