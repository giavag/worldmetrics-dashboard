package com.worldmetrics.backend.service;

import com.worldmetrics.backend.core.exceptions.EntityNotFoundException;
import com.worldmetrics.backend.core.exceptions.RoleNotFoundException;
import com.worldmetrics.backend.core.exceptions.UserAlreadyExistsException;
import com.worldmetrics.backend.dto.CreateUserRequestDTO;
import com.worldmetrics.backend.dto.UpdateUserRequestDTO;
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
import java.util.UUID;

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
        return userRepository.findAllByDeletedFalse()
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

    @Override
    @Transactional
    public void deleteUser(UUID uuid) {
        log.info("Attempting to soft delete user with UUID: {}", uuid);

        User user = userRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new EntityNotFoundException(User.class, uuid.toString()));

        user.setDeleted(true);
        userRepository.save(user);

        log.info("User with UUID: {} was soft deleted successfully", uuid);
    }

    @Override
    @Transactional
    public UserReadOnlyDTO updateUser(UUID uuid, UpdateUserRequestDTO request) {
        log.info("Attempting to update user with UUID: {}", uuid);

        // 1. Find the user
        User user = userRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new EntityNotFoundException(User.class, uuid.toString()));

        // 2. Check if the new email belongs to another user
        if (!user.getEmail().equalsIgnoreCase(request.email())) {
            userRepository.findByEmail(request.email()).ifPresent(existingUser -> {
                throw new UserAlreadyExistsException("Email is already in use by another user");
            });
            user.setEmail(request.email());
        }

        // 3. Update the role (if it is different)
        if (!user.getRole().getName().equalsIgnoreCase(request.role())) {
            Role newRole = roleRepository.findByName(request.role().toUpperCase())
                    .orElseThrow(() -> new RoleNotFoundException("Role not found: " + request.role()));
            user.setRole(newRole);
        }

        // 4. Save and return
        User updatedUser = userRepository.save(user);
        log.info("User with UUID: {} was updated successfully", uuid);

        return userMapper.toReadOnlyDTO(updatedUser);
    }
}
