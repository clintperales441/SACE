package com.sace.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-pro}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Analyze SRS document using Gemini AI
     */
    public String analyzeSRS(String documentText) {
        String prompt = buildSRSAnalysisPrompt(documentText);
        return callGeminiAPI(prompt);
    }

    /**
     * Analyze specific sections of SRS document
     */
    public Map<String, String> analyzeSRSSections(String documentText) {
        Map<String, String> sectionAnalysis = new HashMap<>();

        // Analyze different sections
        sectionAnalysis.put("completeness", analyzeCompleteness(documentText));
        sectionAnalysis.put("consistency", analyzeConsistency(documentText));
        sectionAnalysis.put("clarity", analyzeClarity(documentText));
        sectionAnalysis.put("requirements", extractRequirements(documentText));
        sectionAnalysis.put("suggestions", generateSuggestions(documentText));

        return sectionAnalysis;
    }

    /**
     * Build comprehensive SRS analysis prompt
     */
    private String buildSRSAnalysisPrompt(String documentText) {
        return String.format("""
                You are an expert Software Requirements Specification (SRS) analyst.
                Analyze the following SRS document and provide a comprehensive analysis covering:

                1. Completeness: Are all necessary sections present?
                2. Consistency: Are there any contradictions or inconsistencies?
                3. Clarity: Is the language clear and unambiguous?
                4. Functional Requirements: List and evaluate functional requirements
                5. Non-Functional Requirements: List and evaluate non-functional requirements
                6. Quality Assessment: Rate the overall quality (1-10)
                7. Recommendations: Provide specific improvement suggestions

                SRS Document:
                %s

                Provide a structured analysis with clear sections and bullet points.
                """, documentText);
    }

    /**
     * Analyze completeness of the SRS
     */
    private String analyzeCompleteness(String documentText) {
        String prompt = String.format("""
                Analyze the completeness of this SRS document. Check if it includes:
                - Introduction and Purpose
                - Scope
                - Functional Requirements
                - Non-Functional Requirements
                - System Architecture
                - Use Cases
                - Constraints and Assumptions

                Document:
                %s

                List what's present and what's missing.
                """, documentText);

        return callGeminiAPI(prompt);
    }

    /**
     * Analyze consistency of the SRS
     */
    private String analyzeConsistency(String documentText) {
        String prompt = String.format("""
                Analyze this SRS document for consistency issues:
                - Contradictory requirements
                - Conflicting specifications
                - Inconsistent terminology
                - Version mismatches

                Document:
                %s

                List any inconsistencies found.
                """, documentText);

        return callGeminiAPI(prompt);
    }

    /**
     * Analyze clarity of the SRS
     */
    private String analyzeClarity(String documentText) {
        String prompt = String.format("""
                Analyze this SRS document for clarity:
                - Ambiguous statements
                - Vague requirements
                - Complex or unclear language
                - Missing definitions

                Document:
                %s

                Identify unclear sections and suggest improvements.
                """, documentText);

        return callGeminiAPI(prompt);
    }

    /**
     * Extract and analyze requirements
     */
    private String extractRequirements(String documentText) {
        String prompt = String.format("""
                Extract all functional and non-functional requirements from this SRS document.
                Categorize them and identify:
                - Well-defined requirements
                - Poorly defined requirements
                - Missing priority levels
                - Testability issues

                Document:
                %s

                List requirements in a structured format.
                """, documentText);

        return callGeminiAPI(prompt);
    }

    /**
     * Generate improvement suggestions
     */
    private String generateSuggestions(String documentText) {
        String prompt = String.format("""
                Based on this SRS document, provide specific recommendations for improvement:
                - Missing sections to add
                - Requirements that need clarification
                - Structural improvements
                - Best practices to follow

                Document:
                %s

                Provide actionable suggestions.
                """, documentText);

        return callGeminiAPI(prompt);
    }

    /**
     * Call Gemini API with the given prompt
     */
    private String callGeminiAPI(String prompt) {
        try {
            String url = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    model, apiKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(
                    Map.of("parts", List.of(
                            Map.of("text", prompt)))));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return extractTextFromResponse(response.getBody());
            }

            return "Error: Unable to get response from Gemini API";
        } catch (Exception e) {
            return "Error analyzing document: " + e.getMessage();
        }
    }

    /**
     * Extract text from Gemini API response
     */
    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            return "Error parsing response: " + e.getMessage();
        }
        return "No response text found";
    }
}
