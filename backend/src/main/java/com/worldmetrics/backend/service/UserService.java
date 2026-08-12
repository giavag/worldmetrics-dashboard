package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.CreateUserRequestDTO;
import com.worldmetrics.backend.dto.UpdateUserRequestDTO;
import com.worldmetrics.backend.dto.UserReadOnlyDTO;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserReadOnlyDTO> getAllUsers();

    UserReadOnlyDTO createUser(CreateUserRequestDTO request);

    void deleteUser(UUID uuid);

    UserReadOnlyDTO updateUser(UUID uuid, UpdateUserRequestDTO request);
}
