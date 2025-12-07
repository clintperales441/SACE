package com.sace.controller;

import com.sace.dto.AuthResponse;
import com.sace.dto.GoogleLoginRequest;
import com.sace.dto.LoginRequest;
import com.sace.dto.SignupRequest;
import com.sace.dto.UserDTO;
import com.sace.entity.User;
import com.sace.security.GoogleTokenValidator;
import com.sace.security.JwtTokenProvider;
import com.sace.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private GoogleTokenValidator googleTokenValidator;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User user = userService.signup(signupRequest);
            String token = tokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
            
            AuthResponse response = AuthResponse.of(token, user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> user = userService.login(loginRequest);
        
        if (user.isPresent()) {
            String token = tokenProvider.generateToken(user.get().getEmail(), user.get().getRole(), user.get().getId());
            AuthResponse response = AuthResponse.of(token, user.get());
            return ResponseEntity.ok(response);
        }
        
        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.findByEmail(email);
        
        if (user.isPresent()) {
            UserDTO userDTO = UserDTO.builder()
                .id(user.get().getId())
                .firstName(user.get().getFirstName())
                .lastName(user.get().getLastName())
                .email(user.get().getEmail())
                .profileImageUrl(user.get().getProfileImageUrl())
                .role(user.get().getRole())
                .provider(user.get().getProvider())
                .build();
            return ResponseEntity.ok(userDTO);
        }
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            String token = request.getToken();
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Token is required"));
            }
            
            log.info("Processing Google OAuth login");
            
            // Decode and validate the Google JWT token
            GoogleTokenValidator.GoogleTokenInfo tokenInfo;
            try {
                tokenInfo = googleTokenValidator.decodeToken(token);
                log.info("Token decoded successfully for user: {}", tokenInfo.getEmail());
            } catch (Exception e) {
                log.error("Failed to decode Google token", e);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Invalid Google token: " + e.getMessage()));
            }
            
            // Validate required fields from token
            if (tokenInfo.getSub() == null || tokenInfo.getEmail() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Token missing required user information"));
            }
            
            // Use the actual Google user ID (sub) as the googleId
            String googleId = tokenInfo.getSub();
            log.debug("Google ID from token: {}", googleId);
            
            // Check if user already exists with this Google ID
            Optional<User> existingUser = userService.findByGoogleId(googleId);
            User user;
            
            if (existingUser.isPresent()) {
                user = existingUser.get();
                log.info("Existing Google user found: {}", user.getEmail());
                
                // Update user info in case it changed (e.g., profile picture, name)
                if (tokenInfo.getName() != null) {
                    String[] nameParts = tokenInfo.getName().split(" ", 2);
                    String firstName = nameParts[0];
                    String lastName = nameParts.length > 1 ? nameParts[1] : "";
                    if (!firstName.equals(user.getFirstName()) || !lastName.equals(user.getLastName())) {
                        user.setFirstName(firstName);
                        user.setLastName(lastName);
                    }
                }
                if (tokenInfo.getPicture() != null && !tokenInfo.getPicture().equals(user.getProfileImageUrl())) {
                    user.setProfileImageUrl(tokenInfo.getPicture());
                }
                user = userService.saveUser(user);
            } else {
                // Check if email already exists (user might have signed up with email/password first)
                Optional<User> userByEmail = userService.findByEmail(tokenInfo.getEmail());
                if (userByEmail.isPresent()) {
                    // Link Google account to existing user
                    user = userByEmail.get();
                    user.setGoogleId(googleId);
                    user.setProvider("GOOGLE");
                    if (tokenInfo.getPicture() != null) {
                        user.setProfileImageUrl(tokenInfo.getPicture());
                    }
                    user = userService.saveUser(user);
                    log.info("Linked Google account to existing user: {}", user.getEmail());
                } else {
                    // Create new user with actual Google data
                    String fullName = tokenInfo.getName() != null ? tokenInfo.getName() : "Google User";
                    String[] nameParts = fullName.split(" ", 2);
                    String firstName = nameParts[0];
                    String lastName = nameParts.length > 1 ? nameParts[1] : "";
                    
                    user = User.builder()
                        .email(tokenInfo.getEmail())
                        .firstName(firstName)
                        .lastName(lastName)
                        .googleId(googleId)
                        .provider("GOOGLE")
                        .role("STUDENT")
                        .isActive(true)
                        .profileImageUrl(tokenInfo.getPicture())
                        .password(null) // OAuth users don't have passwords
                        .build();
                    user = userService.saveUser(user);
                    log.info("New Google user created: {} ({} {})", user.getEmail(), user.getFirstName(), user.getLastName());
                }
            }
            
            // Generate JWT token with role and userId
            String jwtToken = tokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
            AuthResponse response = AuthResponse.of(jwtToken, user);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Google login error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }
}
