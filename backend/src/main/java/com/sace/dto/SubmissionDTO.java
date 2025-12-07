package com.sace.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDTO {

    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String status;
    private String googleDriveLink;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String extractedText;
    private String sectionAnalysis;
}
