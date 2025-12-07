package com.sace.controller;

import com.sace.dto.SubmissionDTO;
import com.sace.entity.User;
import com.sace.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
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
}