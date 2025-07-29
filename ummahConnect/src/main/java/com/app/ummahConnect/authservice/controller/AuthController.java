package com.app.ummahConnect.authservice.controller;


import com.app.ummahConnect.authservice.dto.*;
import com.app.ummahConnect.authservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "User logged in successfully", authResponse));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody String refreshToken) {
        AuthResponse authResponse = authService.refreshTokens(refreshToken);
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<String>> me(@RequestHeader("Authorization") String bearerToken) {
        // Just for demo - return email extracted from token
        String token = bearerToken.replace("Bearer ", "");
        String email = authService.getEmailFromToken(token);
        return ResponseEntity.ok(new ApiResponse<>(true, "Current user email", email));
    }
}

