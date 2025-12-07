package com.sace.service;

import com.sace.dto.SubmissionDTO;
import com.sace.entity.Submission;
import com.sace.entity.User;
import com.sace.repository.SubmissionRepository;
import com.sace.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:${user.home}/sace/uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_TYPES = List.of("pdf", "docx");

    // Manual constructor
    public SubmissionService(SubmissionRepository submissionRepository, UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User is not authenticated");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
    }

    public SubmissionDTO uploadFile(User user, MultipartFile file) throws IOException {
        // If user is null from controller, get from SecurityContext
        if (user == null) {
            user = getCurrentUser();
        }
        
        validateFile(file);

        String fileName = file.getOriginalFilename();
        String fileType = FilenameUtils.getExtension(fileName).toLowerCase();
        String storedFileName = System.currentTimeMillis() + "_" + fileName;
        Path filePath = Paths.get(uploadDir, storedFileName);

        // Ensure upload directory exists
        Files.createDirectories(filePath.getParent());

        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Extract text
        String extractedText = extractText(filePath.toFile(), fileType);

        // Detect sections (basic regex-based for now)
        String sectionAnalysis = detectSections(extractedText);

        // Create submission
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setFileName(fileName);
        submission.setFilePath(filePath.toString());
        submission.setFileType(fileType.toUpperCase());
        submission.setFileSize(file.getSize());
        submission.setStatus(Submission.SubmissionStatus.SUBMITTED);
        submission.setExtractedText(extractedText);
        submission.setSectionAnalysis(sectionAnalysis);

        Submission saved = submissionRepository.save(submission);
        return convertToDTO(saved);
    }

    public SubmissionDTO uploadGoogleDriveLink(User user, String driveLink) {
        // If user is null from controller, get from SecurityContext
        if (user == null) {
            user = getCurrentUser();
        }
        
        // Validate link format (basic check)
        if (!driveLink.contains("drive.google.com") && !driveLink.contains("docs.google.com")) {
            throw new IllegalArgumentException("Invalid Google Drive link");
        }

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setFileName("Google Drive Link");
        submission.setFilePath(driveLink);
        submission.setFileType("LINK");
        submission.setFileSize(0L);
        submission.setStatus(Submission.SubmissionStatus.SUBMITTED);
        submission.setGoogleDriveLink(driveLink);

        Submission saved = submissionRepository.save(submission);
        return convertToDTO(saved);
    }

    public List<SubmissionDTO> getUserSubmissions(User user) {
        // If user is null from controller, get from SecurityContext
        if (user == null) {
            user = getCurrentUser();
        }
        
        return submissionRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<SubmissionDTO> getSubmissionById(User user, Long id) {
        // If user is null from controller, get from SecurityContext
        if (user == null) {
            user = getCurrentUser();
        }
        
        return submissionRepository.findByUserAndId(user, id)
                .map(this::convertToDTO);
    }

    public void deleteSubmission(User user, Long id) {
        // If user is null from controller, get from SecurityContext
        if (user == null) {
            user = getCurrentUser();
        }
        
        Optional<Submission> submission = submissionRepository.findByUserAndId(user, id);
        if (submission.isPresent()) {
            Submission sub = submission.get();
            // Delete file if it exists
            if (sub.getFilePath() != null && !sub.getFileType().equals("LINK")) {
                try {
                    Files.deleteIfExists(Paths.get(sub.getFilePath()));
                } catch (IOException e) {
                    log.warn("Failed to delete file: {}", sub.getFilePath(), e);
                }
            }
            submissionRepository.delete(sub);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String extension = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
        if (!ALLOWED_TYPES.contains(extension)) {
            throw new IllegalArgumentException("Only PDF and DOCX files are allowed");
        }
    }

    private String extractText(File file, String fileType) throws IOException {
        if ("pdf".equals(fileType)) {
            try (PDDocument document = Loader.loadPDF(file)) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            }
        } else if ("docx".equals(fileType)) {
            try (FileInputStream fis = new FileInputStream(file);
                 XWPFDocument document = new XWPFDocument(fis)) {
                XWPFWordExtractor extractor = new XWPFWordExtractor(document);
                return extractor.getText();
            }
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    private String detectSections(String text) {
        // Basic regex-based section detection for IEEE 830
        String[] sections = {
            "Introduction", "Overall Description", "Specific Requirements",
            "Functional Requirements", "Non-Functional Requirements",
            "External Interface Requirements", "Appendices"
        };

        StringBuilder analysis = new StringBuilder();
        analysis.append("{");

        for (String section : sections) {
            boolean found = text.toLowerCase().contains(section.toLowerCase());
            analysis.append("\"").append(section).append("\": ").append(found).append(",");
        }

        // Remove last comma and close
        if (analysis.length() > 1) {
            analysis.setLength(analysis.length() - 1);
        }
        analysis.append("}");

        return analysis.toString();
    }

    private SubmissionDTO convertToDTO(Submission submission) {
        return new SubmissionDTO(
                submission.getId(),
                submission.getFileName(),
                submission.getFileType(),
                submission.getFileSize(),
                submission.getStatus().name(),
                submission.getGoogleDriveLink(),
                submission.getCreatedAt(),
                submission.getUpdatedAt(),
                submission.getExtractedText(),
                submission.getSectionAnalysis()
        );
    }
}