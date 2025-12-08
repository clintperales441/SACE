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
    private final GeminiService geminiService;

    @Value("${app.upload.dir:${user.home}/sace/uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_TYPES = List.of("pdf", "docx");

    // Manual constructor
    public SubmissionService(SubmissionRepository submissionRepository,
            UserRepository userRepository,
            GeminiService geminiService) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
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

        // Analyze with Gemini AI
        String sectionAnalysis = analyzeWithGemini(extractedText);

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

        log.info("Uploading Google Drive link: {}", driveLink);

        // Validate link format (basic check)
        if (!driveLink.contains("drive.google.com") && !driveLink.contains("docs.google.com")) {
            throw new IllegalArgumentException("Invalid Google Drive link");
        }

        // Try to extract content from Google Drive link
        String extractedText = "";
        String sectionAnalysis = "";
        String fileName = "Google Drive Document";

        try {
            // Convert Google Drive link to export URL
            String fileId = extractFileIdFromDriveLink(driveLink);

            if (fileId != null) {
                log.info("Extracted file ID: {}", fileId);

                // Try to download and extract text from the file
                Path tempFile = null;
                try {
                    // Download file to temporary location
                    tempFile = downloadGoogleDriveFile(fileId);

                    if (tempFile != null && Files.exists(tempFile)) {
                        // Detect file type from content or use generic
                        String fileType = detectFileType(tempFile);
                        fileName = "Google Drive - " + fileId + "." + fileType.toLowerCase();

                        // Extract text using existing methods (needs lowercase file type)
                        extractedText = extractText(tempFile.toFile(), fileType.toLowerCase());
                        log.info("Extracted {} characters from Google Drive file", extractedText.length());

                        if (!extractedText.isEmpty()) {
                            // Analyze with Gemini AI
                            log.info("Analyzing content with Gemini AI...");
                            sectionAnalysis = analyzeWithGemini(extractedText);
                            log.info("Gemini AI analysis completed");
                        } else {
                            sectionAnalysis = "Unable to extract text from the document. The file may be empty or in an unsupported format.";
                        }
                    } else {
                        sectionAnalysis = "Unable to download file from Google Drive. Please ensure the link is publicly accessible (Anyone with the link can view).";
                    }
                } finally {
                    // Clean up temporary file
                    if (tempFile != null && Files.exists(tempFile)) {
                        try {
                            Files.delete(tempFile);
                        } catch (IOException e) {
                            log.warn("Failed to delete temporary file: {}", tempFile, e);
                        }
                    }
                }
            } else {
                log.warn("Could not extract file ID from Drive link");
                sectionAnalysis = "Invalid Google Drive link format. Please check the link and try again.";
            }
        } catch (Exception e) {
            log.error("Error processing Google Drive link: {}", e.getMessage(), e);
            sectionAnalysis = "Unable to process Google Drive link. Please ensure the link is publicly accessible (Anyone with the link can view) or upload the file directly. Error: "
                    + e.getMessage();
        }

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setFileName(fileName);
        submission.setFilePath(driveLink);
        submission.setFileType("LINK");
        submission.setFileSize(0L);
        submission.setStatus(Submission.SubmissionStatus.SUBMITTED);
        submission.setGoogleDriveLink(driveLink);
        submission.setExtractedText(extractedText);
        submission.setSectionAnalysis(sectionAnalysis);

        Submission saved = submissionRepository.save(submission);
        return convertToDTO(saved);
    }

    /**
     * Extract file ID from Google Drive link
     */
    private String extractFileIdFromDriveLink(String driveLink) {
        try {
            log.info("Extracting file ID from Drive link: {}", driveLink);

            String fileId = null;

            if (driveLink.contains("/file/d/")) {
                // Format: https://drive.google.com/file/d/FILE_ID/view
                fileId = driveLink.split("/file/d/")[1].split("/")[0].split("\\?")[0];
                log.info("Extracted file ID from /file/d/ format: {}", fileId);
            } else if (driveLink.contains("id=")) {
                // Format: https://drive.google.com/open?id=FILE_ID
                fileId = driveLink.split("id=")[1].split("&")[0];
                log.info("Extracted file ID from id= format: {}", fileId);
            } else if (driveLink.contains("docs.google.com/document/d/")) {
                // Format: https://docs.google.com/document/d/FILE_ID/edit
                fileId = driveLink.split("/document/d/")[1].split("/")[0].split("\\?")[0];
                log.info("Extracted file ID from /document/d/ format: {}", fileId);
            }

            return fileId;
        } catch (Exception e) {
            log.error("Error extracting file ID from Google Drive link: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Download file from Google Drive to temporary location
     */
    private Path downloadGoogleDriveFile(String fileId) {
        try {
            String downloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
            log.info("Downloading file from: {}", downloadUrl);

            java.net.URL url = new java.net.URL(downloadUrl);
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(30000);
            connection.setReadTimeout(30000);
            connection.setInstanceFollowRedirects(true);

            int responseCode = connection.getResponseCode();
            log.info("HTTP Response Code: {}", responseCode);

            if (responseCode == 200) {
                // Create temporary file
                Path tempFile = Files.createTempFile("gdrive_", "_temp");

                // Download file
                try (java.io.InputStream in = connection.getInputStream();
                        java.io.FileOutputStream out = new java.io.FileOutputStream(tempFile.toFile())) {

                    byte[] buffer = new byte[8192];
                    int bytesRead;
                    long totalBytes = 0;

                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                        totalBytes += bytesRead;
                    }

                    log.info("Downloaded {} bytes to temporary file: {}", totalBytes, tempFile);
                    return tempFile;
                }
            } else {
                log.warn("Failed to download Google Drive file. Response code: {}", responseCode);
            }
        } catch (Exception e) {
            log.error("Error downloading Google Drive file: {}", e.getMessage(), e);
        }
        return null;
    }

    /**
     * Detect file type from file content
     */
    private String detectFileType(Path file) {
        try {
            byte[] header = new byte[8];
            try (java.io.FileInputStream fis = new java.io.FileInputStream(file.toFile())) {
                fis.read(header);
            }

            // Check PDF signature
            if (header[0] == 0x25 && header[1] == 0x50 && header[2] == 0x44 && header[3] == 0x46) {
                return "PDF";
            }

            // Check DOCX signature (ZIP with specific content)
            if (header[0] == 0x50 && header[1] == 0x4B) {
                return "DOCX";
            }

            log.warn("Unknown file type, defaulting to PDF");
            return "PDF";
        } catch (Exception e) {
            log.error("Error detecting file type: {}", e.getMessage(), e);
            return "PDF";
        }
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

    /**
     * Analyze SRS document using Gemini AI
     */
    private String analyzeWithGemini(String extractedText) {
        try {
            log.info("Analyzing document with Gemini AI");

            // Use Gemini service for comprehensive analysis
            String analysis = geminiService.analyzeSRS(extractedText);

            log.info("Gemini AI analysis completed successfully");
            return analysis;

        } catch (Exception e) {
            log.error("Error analyzing with Gemini AI: {}", e.getMessage());
            // Fallback to basic section detection if Gemini fails
            return detectSections(extractedText);
        }
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
                submission.getSectionAnalysis());
    }
}