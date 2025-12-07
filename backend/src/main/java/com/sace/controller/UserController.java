package com.sace.controller;

import com.sace.dto.UserDTO;
import com.sace.entity.User;
import com.sace.security.JwtTokenProvider;
import com.sace.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Get current authenticated user's profile
     * Endpoint: GET /api/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract JWT token from Authorization header
            String token = authHeader.replace("Bearer ", "");
            
            // Get email from JWT
            String email = tokenProvider.getEmailFromJwt(token);
            
            // Fetch user from database
            Optional<User> userOptional = userService.findByEmail(email);
            
            if (userOptional.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            User user = userOptional.get();
            
            // Convert to UserDTO
            UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .provider(user.getProvider())
                .build();
            
            log.info("Retrieved profile for user: {}", email);
            return ResponseEntity.ok(userDTO);
            
        } catch (Exception e) {
            log.error("Error retrieving current user", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve user profile");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get user by ID
     * Endpoint: GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userService.getUserById(id);
            
            if (userOptional.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            User user = userOptional.get();
            
            // Convert to UserDTO
            UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .provider(user.getProvider())
                .build();
            
            return ResponseEntity.ok(userDTO);
            
        } catch (Exception e) {
            log.error("Error retrieving user by ID: {}", id, e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve user");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update current user's profile
     * Endpoint: PUT /api/users/me
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserDTO updateRequest) {
        try {
            // Extract JWT token from Authorization header
            String token = authHeader.replace("Bearer ", "");
            
            // Get email from JWT
            String email = tokenProvider.getEmailFromJwt(token);
            
            // Fetch user from database
            Optional<User> userOptional = userService.findByEmail(email);
            
            if (userOptional.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            User user = userOptional.get();
            
            // Update user fields
            if (updateRequest.getFirstName() != null) {
                user.setFirstName(updateRequest.getFirstName());
            }
            if (updateRequest.getLastName() != null) {
                user.setLastName(updateRequest.getLastName());
            }
            if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
                // Check if new email already exists
                if (userService.findByEmail(updateRequest.getEmail()).isPresent()) {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Email already in use");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                }
                user.setEmail(updateRequest.getEmail());
            }
            
            // Save updated user
            User updatedUser = userService.saveUser(user);
            
            // Convert to UserDTO
            UserDTO userDTO = UserDTO.builder()
                .id(updatedUser.getId())
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .email(updatedUser.getEmail())
                .profileImageUrl(updatedUser.getProfileImageUrl())
                .role(updatedUser.getRole())
                .provider(updatedUser.getProvider())
                .build();
            
            log.info("Updated profile for user: {}", email);
            return ResponseEntity.ok(userDTO);
            
        } catch (Exception e) {
            log.error("Error updating current user", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update user profile");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
