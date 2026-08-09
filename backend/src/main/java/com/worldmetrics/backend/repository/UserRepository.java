package com.worldmetrics.backend.repository;

import com.worldmetrics.backend.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByUuid(UUID uuid);

    @EntityGraph(attributePaths = {"role", "role.capabilities"})
    Optional<User> findByEmail(String email);

    Optional<User> findByUuidAndDeletedFalse(UUID uuid);
    Optional<User> findByEmailAndDeletedFalse(String email);
}