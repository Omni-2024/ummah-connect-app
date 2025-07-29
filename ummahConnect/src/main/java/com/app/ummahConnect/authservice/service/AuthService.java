package com.app.ummahConnect.authservice.service;


import com.app.ummahConnect.authservice.dto.AuthResponse;
import com.app.ummahConnect.authservice.dto.LoginRequest;
import com.app.ummahConnect.authservice.dto.RegisterRequest;
import com.app.ummahConnect.authservice.model.User;
import com.app.ummahConnect.authservice.repository.UserRepository;
import com.app.ummahConnect.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole() != null ? req.getRole() : com.app.ummahConnect.authservice.model.Role.CONSUMER)
                .build();

        userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse refreshTokens(String refreshToken) {
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = jwtUtil.getEmailFromAccessToken(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!refreshToken.equals(user.getRefreshToken())) {
            throw new RuntimeException("Refresh token mismatch");
        }

        String newAccessToken = jwtUtil.generateAccessToken(email);
        String newRefreshToken = jwtUtil.generateRefreshToken(email);

        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return new AuthResponse(newAccessToken, newRefreshToken);
    }

    public String getEmailFromToken(String token) {
        if (!jwtUtil.validateAccessToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        return jwtUtil.getEmailFromAccessToken(token);
    }

}

