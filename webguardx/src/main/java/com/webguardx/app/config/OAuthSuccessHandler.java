package com.webguardx.app.config;

import java.io.IOException;
import java.time.LocalDateTime;

import com.webguardx.app.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.webguardx.app.model.User;
import com.webguardx.app.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(oauthUser.getAttribute("name"));
                    newUser.setPicture(oauthUser.getAttribute("picture"));
                    newUser.setRole("USER");
                    newUser.setProvider("GOOGLE");
                    newUser.setCreatedAt(LocalDateTime.now());
                    return newUser;
                });

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        response.setContentType("application/json");
        response.getWriter().write("""
        {
          "token": "%s",
          "email": "%s",
          "role": "%s"
        }
        """.formatted(token, user.getEmail(), user.getRole()));
    }
}
