package com.sliit.paf.smartcampus.repository;

import com.sliit.paf.smartcampus.enums.Role;
import com.sliit.paf.smartcampus.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}
