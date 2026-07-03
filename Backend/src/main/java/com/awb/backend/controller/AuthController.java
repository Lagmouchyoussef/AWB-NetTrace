package com.awb.backend.controller;

import com.awb.backend.core.entity.LoginAttempt;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.LoginAttemptRepository;
import com.awb.backend.core.repository.UserAllowedIpRepository;
import com.awb.backend.core.repository.UserRepository;
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
  private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";
  private static final String ERROR_KEY = "error";

  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final UserRepository userRepository;
  private final UserAllowedIpRepository userAllowedIpRepository;
  private final LoginAttemptRepository loginAttemptRepository;
  private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();

  public AuthController(
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      UserRepository userRepository,
      UserAllowedIpRepository userAllowedIpRepository,
      LoginAttemptRepository loginAttemptRepository) {
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.userRepository = userRepository;
    this.userAllowedIpRepository = userAllowedIpRepository;
    this.loginAttemptRepository = loginAttemptRepository;
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(
      @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
    String clientIp = httpRequest.getRemoteAddr();

    Bucket bucket = loginBuckets.computeIfAbsent(clientIp, key -> newBucket());
    if (!bucket.tryConsume(1)) {
      return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
          .body(Map.of(ERROR_KEY, "Too many login attempts, please try again later"));
    }

    Authentication authentication;
    try {
      authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  request.getUsername(), request.getPassword()));
    } catch (AuthenticationException e) {
      recordAttempt(request.getUsername(), clientIp, false);
      // Deliberately identical response whether the username or the password was wrong.
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of(ERROR_KEY, INVALID_CREDENTIALS_MESSAGE));
    }

    User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
    if (user.isIpRestrictionEnabled() && !isIpAllowed(user, clientIp)) {
      recordAttempt(request.getUsername(), clientIp, false);
      // Same generic response as any other failure - never reveal that IP restriction
      // was the specific cause.
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of(ERROR_KEY, INVALID_CREDENTIALS_MESSAGE));
    }

    String role = extractRole(authentication);

    String expectedRole = request.getExpectedRole();
    if (expectedRole != null && !expectedRole.isBlank() && !expectedRole.equals(role)) {
      recordAttempt(request.getUsername(), clientIp, false);
      // Same generic response as any other failure - a role-specific login page never
      // reveals that the credentials were valid for a different role.
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Map.of(ERROR_KEY, INVALID_CREDENTIALS_MESSAGE));
    }

    recordAttempt(request.getUsername(), clientIp, true);
    String token = jwtService.generateToken(request.getUsername(), role);
    String expiresAt = Instant.now().plusMillis(jwtService.getExpirationMillis()).toString();
    return ResponseEntity.ok(Map.of("token", token, "expiresAt", expiresAt));
  }

  @GetMapping("/me")
  public ResponseEntity<Map<String, String>> me(Authentication authentication) {
    String role = extractRole(authentication);
    return ResponseEntity.ok(Map.of("username", authentication.getName(), "role", role));
  }

  private boolean isIpAllowed(User user, String clientIp) {
    return userAllowedIpRepository.findByUserId(user.getId()).stream()
        .anyMatch(allowed -> allowed.getIpAddress().equals(clientIp));
  }

  private void recordAttempt(String username, String ip, boolean success) {
    LoginAttempt attempt = new LoginAttempt();
    attempt.setUsername(username);
    attempt.setIpAddress(ip);
    attempt.setSuccess(success);
    attempt.setAttemptedAt(Instant.now());
    loginAttemptRepository.save(attempt);
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
