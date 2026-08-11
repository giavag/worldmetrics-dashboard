package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.CreateUserRequestDTO;
import com.worldmetrics.backend.dto.UserReadOnlyDTO;

import java.util.List;

public interface UserService {
    List<UserReadOnlyDTO> getAllUsers();

    UserReadOnlyDTO createUser(CreateUserRequestDTO request);
}
