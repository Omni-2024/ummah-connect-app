package com.app.ummahConnect.authservice.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key jwtSecretKey;
    private final Key refreshSecretKey;

    private final long jwtExpirationMs;
    private final long refreshExpirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.refresh.secret}") String refreshSecret,
            @Value("${jwt.expiration}") long jwtExpirationMs,
            @Value("${jwt.refresh.expiration}") long refreshExpirationMs) {
        this.jwtSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.refreshSecretKey = Keys.hmacShaKeyFor(refreshSecret.getBytes());
        this.jwtExpirationMs = jwtExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    public String generateAccessToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(jwtSecretKey)
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationMs))
                .signWith(refreshSecretKey)
                .compact();
    }

    public String getEmailFromAccessToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateAccessToken(String token) {
        return validateToken(token, jwtSecretKey);
    }

    public boolean validateRefreshToken(String token) {
        return validateToken(token, refreshSecretKey);
    }

    private boolean validateToken(String token, Key key) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}

