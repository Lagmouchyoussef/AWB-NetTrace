package com.awb.backend.security;

import com.awb.backend.core.entity.PermissionModule;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.UserRepository;
import com.awb.backend.core.util.PermissionDecisionService;
import com.awb.backend.core.util.PermissionModuleResolver;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

// Runs after JwtAuthenticationFilter has populated the SecurityContext. SecurityConfig used to
// hard-gate each /api/roles/{role}/** prefix with hasRole(...); that per-role wall is now relaxed
// to a plain .authenticated() check, and THIS filter makes the real per-module decision - so a
// Super Admin's per-user grant/block (UserPermissionOverride) or per-role default
// (RolePermission) can actually take effect, including across role boundaries.
public class ModulePermissionFilter extends OncePerRequestFilter {

  private static final Pattern ROLE_SLUG_PATTERN =
      Pattern.compile("^/api/roles/([a-z-]+)(?:/.*)?$");

  private final UserRepository userRepository;
  private final PermissionModuleResolver moduleResolver;
  private final PermissionDecisionService decisionService;

  public ModulePermissionFilter(
      UserRepository userRepository,
      PermissionModuleResolver moduleResolver,
      PermissionDecisionService decisionService) {
    this.userRepository = userRepository;
    this.moduleResolver = moduleResolver;
    this.decisionService = decisionService;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String path = request.getServletPath();
    Matcher slugMatcher = ROLE_SLUG_PATTERN.matcher(path);

    if (!slugMatcher.matches()) {
      chain.doFilter(request, response);
      return;
    }

    Optional<PermissionModule> module = moduleResolver.resolve(path);
    if (module.isEmpty()) {
      // Not a module-gated segment (dashboard, scope, my-account, ai/*, ping, ...) - always
      // allowed once authenticated.
      chain.doFilter(request, response);
      return;
    }

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      // No/invalid token: let the normal chain produce the usual 401.
      chain.doFilter(request, response);
      return;
    }

    Optional<User> user = userRepository.findByUsername(authentication.getName());
    if (user.isEmpty()) {
      chain.doFilter(request, response);
      return;
    }

    boolean granted =
        decisionService.isGrantedForRequest(user.get(), slugMatcher.group(1), module.get());
    if (!granted) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response
          .getWriter()
          .write("{\"error\":\"Access to this module has been restricted for your account.\"}");
      return;
    }

    chain.doFilter(request, response);
  }
}
