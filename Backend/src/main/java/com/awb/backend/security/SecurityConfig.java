package com.awb.backend.security;

import com.awb.backend.core.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public UserDetailsService userDetailsService(UserRepository userRepository) {
    return username ->
        userRepository
            .findByUsername(username)
            .map(
                user ->
                    User.withUsername(user.getUsername())
                        .password(user.getPasswordHash())
                        .disabled(!user.isEnabled())
                        .authorities("ROLE_" + user.getRole().name())
                        .build())
            .orElseThrow(
                () -> new UsernameNotFoundException("No user found with username: " + username));
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
      throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity http, JwtService jwtService, CorsConfigurationSource corsConfigurationSource)
      throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource))
        .csrf(csrf -> csrf.disable()) // stateless bearer-token API, no cookies/session in play
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(
            exceptions ->
                exceptions
                    // No/invalid/expired JWT: 401, so the frontend can tell "not logged in"
                    // apart from "logged in but wrong role" (403) and redirect to login.
                    .authenticationEntryPoint(
                        (request, response, authException) ->
                            writeJsonError(response, 401, "Authentication required"))
                    .accessDeniedHandler(
                        (request, response, accessDeniedException) ->
                            writeJsonError(response, 403, "Access denied")))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/api/auth/login", "/error")
                    .permitAll()
                    .requestMatchers("/api/roles/super-admin/**")
                    .hasRole("SUPER_ADMIN")
                    .requestMatchers("/api/roles/dc-admin/**")
                    .hasRole("DC_ADMIN")
                    .requestMatchers("/api/roles/network-engineer/**")
                    .hasRole("NETWORK_ENGINEER")
                    .requestMatchers("/api/roles/technician/**")
                    .hasRole("TECHNICIAN")
                    .requestMatchers("/api/roles/approver/**")
                    .hasRole("APPROVER")
                    .requestMatchers("/api/roles/requester/**")
                    .hasRole("REQUESTER")
                    .requestMatchers("/api/roles/auditor/**")
                    .hasRole("AUDITOR")
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(
            new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  private static void writeJsonError(HttpServletResponse response, int status, String message)
      throws IOException {
    response.setStatus(status);
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.getWriter().write("{\"error\":\"" + message + "\"}");
  }
}
