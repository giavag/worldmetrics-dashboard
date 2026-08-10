package com.worldmetrics.backend.mapper;

import com.worldmetrics.backend.dto.RegisterRequestDTO;
import com.worldmetrics.backend.dto.UserReadOnlyDTO;
import com.worldmetrics.backend.model.Role;
import com.worldmetrics.backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    // Converts the DTO, the encoded password, and the Role into a User Entity
    public User toUser(RegisterRequestDTO dto, String encodedPassword, Role role) {
        User user = new User();
        user.setEmail(dto.email());
        user.setPassword(encodedPassword);
        user.setRole(role);
        return user;
    }

    public UserReadOnlyDTO toReadOnlyDTO(User user) {
        return new UserReadOnlyDTO(
                user.getId(),
                user.getEmail(),
                user.getRole().getName()
        );
    }
}