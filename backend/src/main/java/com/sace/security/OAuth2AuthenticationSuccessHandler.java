package com.sace.security;

import com.sace.entity.User;
import com.sace.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getName();
        String profileImageUrl = oAuth2User.getAttribute("picture");

        User user = userRepository.findByGoogleId(googleId)
            .orElseGet(() -> {
                User newUser = User.builder()
                    .googleId(googleId)
                    .email(email)
                    .name(name)
                    .profileImageUrl(profileImageUrl)
                    .provider("GOOGLE")
                    .role("USER")
                    .build();
                return userRepository.save(newUser);
            });

        return oAuth2User;
    }
}
