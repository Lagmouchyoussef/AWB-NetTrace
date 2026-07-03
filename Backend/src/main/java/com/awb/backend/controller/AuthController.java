package com.awb.backend.controller;

import com.awb.backend.dto.LoginRequest;
import com.awb.backend.security.JwtService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private static final int LOGIN_ATTEMPTS_PER_MINUTE = 5;
  private static final String ROLE_PREFIX = "ROLE_";

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();

  public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(
      @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
    Bucket bucket = loginBuckets.computeIfAbsent(httpRequest.getRemoteAddr(), key -> newBucket());
    if (!bucket.tryConsume(1)) {
      return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
          .body(Map.of("error", "Too many login attempts, please try again later"));
    }

    Authentication authentication;
    try {
      authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  request.getUsername(), request.getPassword()));
    } catch (AuthenticationException e) {
      // Deliberately identical response whether the username or the password was wrong.
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of("error", "Invalid credentials"));
    }

    String role = extractRole(authentication);
    String token = jwtService.generateToken(request.getUsername(), role);
    String expiresAt = Instant.now().plusMillis(jwtService.getExpirationMillis()).toString();
    return ResponseEntity.ok(Map.of("token", token, "expiresAt", expiresAt));
  }

  @GetMapping("/me")
  public ResponseEntity<Map<String, String>> me(Authentication authentication) {
    String role = extractRole(authentication);
    return ResponseEntity.ok(Map.of("username", authentication.getName(), "role", role));
  }

  private String extractRole(Authentication authentication) {
    return authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .filter(authority -> authority.startsWith(ROLE_PREFIX))
        .map(authority -> authority.substring(ROLE_PREFIX.length()))
        .findFirst()
        .orElse("");
  }

  private Bucket newBucket() {
    Bandwidth limit =
        Bandwidth.builder()
            .capacity(LOGIN_ATTEMPTS_PER_MINUTE)
            .refillGreedy(LOGIN_ATTEMPTS_PER_MINUTE, Duration.ofMinutes(1))
            .build();
    return Bucket.builder().addLimit(limit).build();
  }
}
