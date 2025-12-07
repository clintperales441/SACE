package com.sace.controller;

import com.sace.dto.UserDTO;
import com.sace.entity.User;
import com.sace.security.JwtTokenProvider;
import com.sace.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get current authenticated user's profile
     * Endpoint: GET /api/users/me
     */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR')")
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
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR')")
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
            if (updateRequest.getPassword() != null && !updateRequest.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
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

    /**
     * Change current user's password
     * Endpoint: PUT /api/users/me/password
     */
    @PutMapping("/me/password")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR')")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> passwordRequest) {
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

            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");

            // Validate input
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Current password is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "New password is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (newPassword.length() < 6) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "New password must be at least 6 characters long");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Current password is incorrect");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userService.saveUser(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            log.info("Changed password for user: {}", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error changing password", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to change password");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete current user's account
     * Endpoint: DELETE /api/users/me
     */
    @DeleteMapping("/me")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR')")
    public ResponseEntity<?> deleteCurrentUser(@RequestHeader("Authorization") String authHeader) {
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

            // Delete the user
            userService.deleteUser(user.getId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "User account deleted successfully");
            log.info("Deleted account for user: {}", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error deleting current user", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete user account");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
