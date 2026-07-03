package com.awb.backend.config;

import com.awb.backend.core.entity.Role;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.repository.UserRepository;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds one demo user per role on first startup (only if the users table is empty). Dev/demo data
 * only - do not rely on this for production user provisioning.
 */
@Component
public class DemoUserSeeder implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final String demoPassword;

  public DemoUserSeeder(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      @Value("${app.security.demo-users-password}") String demoPassword) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.demoPassword = demoPassword;
  }

  @Override
  public void run(String... args) {
    if (userRepository.count() > 0) {
      return;
    }

    seed("super.admin", Role.SUPER_ADMIN);
    seed("dc.admin", Role.DC_ADMIN);
    seed("network.engineer", Role.NETWORK_ENGINEER);
    seed("technician", Role.TECHNICIAN);
    seed("approver", Role.APPROVER);
    seed("requester", Role.REQUESTER);
    seed("auditor", Role.AUDITOR);
  }

  private void seed(String username, Role role) {
    User user = new User();
    user.setUsername(username);
    user.setPasswordHash(passwordEncoder.encode(demoPassword));
    user.setRole(role);
    user.setEnabled(true);
    user.setCreatedAt(Instant.now());
    userRepository.save(user);
  }
}
