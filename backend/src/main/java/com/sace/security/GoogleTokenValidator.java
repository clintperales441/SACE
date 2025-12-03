package com.sace.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.Base64;

/**
 * Validates and decodes Google OAuth JWT tokens
 * Google tokens are in format: header.payload.signature
 */
@Component
@Slf4j
public class GoogleTokenValidator {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Decode Google JWT token without verification (for development)
     * In production, use Google's tokeninfo endpoint for verification
     */
    public GoogleTokenInfo decodeToken(String token) throws Exception {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                throw new IllegalArgumentException("Invalid token format. Expected 3 parts");
            }

            // Decode payload (second part)
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode jsonNode = objectMapper.readTree(payload);

            log.debug("Token decoded successfully");
            log.debug("Token issuer: {}", jsonNode.get("iss"));
            log.debug("Token audience: {}", jsonNode.get("aud"));
            log.debug("Token email: {}", jsonNode.get("email"));

            GoogleTokenInfo tokenInfo = new GoogleTokenInfo();
            tokenInfo.setSub(jsonNode.get("sub").asText());
            tokenInfo.setEmail(jsonNode.has("email") ? jsonNode.get("email").asText() : null);
            tokenInfo.setName(jsonNode.has("name") ? jsonNode.get("name").asText() : null);
            tokenInfo.setPicture(jsonNode.has("picture") ? jsonNode.get("picture").asText() : null);
            tokenInfo.setIssuer(jsonNode.get("iss").asText());
            tokenInfo.setAudience(jsonNode.get("aud").asText());

            return tokenInfo;
        } catch (Exception e) {
            log.error("Failed to decode Google token: {}", e.getMessage());
            throw new RuntimeException("Invalid Google token: " + e.getMessage());
        }
    }

    /**
     * For production: Verify token with Google's tokeninfo endpoint
     * This ensures the token is actually from Google and hasn't been forged
     */
    public boolean verifyTokenWithGoogle(String token) {
        // Implementation for production:
        // 1. Call https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}
        // 2. Check if response contains valid email and sub
        // For now, we trust the client-side validation
        log.info("Token verification skipped (development mode)");
        return true;
    }

    /**
     * Holder class for decoded Google token information
     */
    public static class GoogleTokenInfo {
        private String sub;           // Google user ID
        private String email;         // User email
        private String name;          // User name
        private String picture;       // User picture URL
        private String issuer;        // Token issuer (should be accounts.google.com)
        private String audience;      // Client ID

        // Getters and setters
        public String getSub() { return sub; }
        public void setSub(String sub) { this.sub = sub; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }

        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }

        public String getAudience() { return audience; }
        public void setAudience(String audience) { this.audience = audience; }

        @Override
        public String toString() {
            return "GoogleTokenInfo{" +
                    "sub='" + sub + '\'' +
                    ", email='" + email + '\'' +
                    ", name='" + name + '\'' +
                    ", issuer='" + issuer + '\'' +
                    '}';
        }
    }
}
