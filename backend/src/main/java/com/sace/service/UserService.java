package com.sace.service;

import com.sace.dto.LoginRequest;
import com.sace.dto.SignupRequest;
import com.sace.entity.User;
import com.sace.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User signup(SignupRequest signupRequest) {
        if (!signupRequest.getPassword().equals(signupRequest.getPasswordConfirm())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
            .name(signupRequest.getName())
            .email(signupRequest.getEmail())
            .password(passwordEncoder.encode(signupRequest.getPassword()))
            .provider("LOCAL")
            .role("USER")
            .build();

        return userRepository.save(user);
    }

    public Optional<User> login(LoginRequest loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            return user;
        }
        
        return Optional.empty();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }
}
