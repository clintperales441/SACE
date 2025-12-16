package com.sace.controller;

import com.sace.dto.SubmissionDTO;
import com.sace.entity.User;
import com.sace.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:3000" })
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        try {
            SubmissionDTO submission = submissionService.uploadFile(user, file);
            return ResponseEntity.ok(submission);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (IOException e) {
            log.error("File upload failed", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "File upload failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/link")
    public ResponseEntity<?> uploadGoogleDriveLink(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> request) {
        try {
            String driveLink = request.get("driveLink");
            if (driveLink == null || driveLink.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Drive link is required");
                return ResponseEntity.badRequest().body(error);
            }

            SubmissionDTO submission = submissionService.uploadGoogleDriveLink(user, driveLink);
            return ResponseEntity.ok(submission);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<SubmissionDTO>> getUserSubmissions(@AuthenticationPrincipal User user) {
        List<SubmissionDTO> submissions = submissionService.getUserSubmissions(user);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SubmissionDTO>> getAllSubmissions() {
        try {
            // Get authentication from SecurityContext
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            log.info("Authentication: {}", authentication);

            if (authentication == null || !authentication.isAuthenticated()) {
                log.warn("No authentication found");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Check if user has INSTRUCTOR role
            boolean isInstructor = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"));

            log.info("User: {}, Authorities: {}, Is Instructor: {}",
                    authentication.getPrincipal(), authentication.getAuthorities(), isInstructor);

            if (!isInstructor) {
                log.warn("User is not an instructor");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            log.info("User is instructor, fetching all submissions");
            List<SubmissionDTO> submissions = submissionService.getAllSubmissions();
            log.info("Found {} submissions", submissions.size());
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            log.error("Error in getAllSubmissions", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Optional<SubmissionDTO> submission = submissionService.getSubmissionById(user, id);
        if (submission.isPresent()) {
            return ResponseEntity.ok(submission.get());
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Submission not found");
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        try {
            submissionService.deleteSubmission(user, id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Submission deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to delete submission", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete submission");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            // Get authentication from SecurityContext
            var authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                log.warn("No authentication found");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Check if user has INSTRUCTOR role
            boolean isInstructor = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"));

            if (!isInstructor) {
                log.warn("User is not an instructor");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            String status = request.get("status");
            if (status == null || status.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Status is required");
                return ResponseEntity.badRequest().body(error);
            }

            SubmissionDTO updatedSubmission = submissionService.updateSubmissionStatus(id, status);
            return ResponseEntity.ok(updatedSubmission);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Error updating submission status", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update submission status");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}