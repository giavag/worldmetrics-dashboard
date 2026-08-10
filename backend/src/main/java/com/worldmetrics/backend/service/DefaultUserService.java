package com.worldmetrics.backend.service;

import com.worldmetrics.backend.dto.UserReadOnlyDTO;
import com.worldmetrics.backend.mapper.UserMapper;
import com.worldmetrics.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DefaultUserService implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserReadOnlyDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toReadOnlyDTO)
                .toList();
    }
}
