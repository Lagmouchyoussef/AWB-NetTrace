package com.awb.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private static final String BEARER_PREFIX = "Bearer ";

  // The browser's native EventSource API cannot set an Authorization header, so the SSE stream
  // is the one endpoint allowed to authenticate via a query param instead. Scoped to this single
  // path so no other endpoint's tokens end up in access logs / browser history.
  private static final String SSE_STREAM_PATH = "/api/notifications/stream";

  private final JwtService jwtService;

  public JwtAuthenticationFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    String token = null;

    if (header != null && header.startsWith(BEARER_PREFIX)) {
      token = header.substring(BEARER_PREFIX.length());
    } else if (SSE_STREAM_PATH.equals(request.getServletPath())) {
      token = request.getParameter("token");
    }

    if (token != null && jwtService.isTokenValid(token)) {
      String username = jwtService.extractUsername(token);
      String role = jwtService.extractRole(token);
      var authorities =
          role != null
              ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
              : List.<SimpleGrantedAuthority>of();
      var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    chain.doFilter(request, response);
  }
}
