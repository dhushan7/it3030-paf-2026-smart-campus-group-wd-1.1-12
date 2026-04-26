package com.sliit.paf.smartcampus.service;

import com.sliit.paf.smartcampus.dto.AuthResponse;
import com.sliit.paf.smartcampus.dto.LoginRequest;
import com.sliit.paf.smartcampus.dto.RegisterRequest;
import com.sliit.paf.smartcampus.enums.Role;
import com.sliit.paf.smartcampus.model.User;
import com.sliit.paf.smartcampus.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole().name(), user.getPicture());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole().name(), user.getPicture());
    }

    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public User updateRole(String userId, Role role) {
        User user = findById(userId);
        user.setRole(role);
        return userRepository.save(user);
    }

    public User saveOAuthUser(String googleId, String name, String email, String picture) {
        return userRepository.findByGoogleId(googleId).orElseGet(() ->
                userRepository.findByEmail(email).map(existing -> {
                    existing.setGoogleId(googleId);
                    existing.setPicture(picture);
                    return userRepository.save(existing);
                }).orElseGet(() -> {
                    User newUser = new User();
                    newUser.setGoogleId(googleId);
                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setPicture(picture);
                    newUser.setRole(Role.USER);
                    return userRepository.save(newUser);
                })
        );
    }
}
