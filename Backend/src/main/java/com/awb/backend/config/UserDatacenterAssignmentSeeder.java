package com.awb.backend.config;

import com.awb.backend.core.entity.User;
import com.awb.backend.core.entity.UserDatacenterAssignment;
import com.awb.backend.core.repository.DatacenterRepository;
import com.awb.backend.core.repository.UserDatacenterAssignmentRepository;
import com.awb.backend.core.repository.UserRepository;
import java.time.Instant;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Assigns the demo dc.admin user to a couple of demo datacenters on first startup (only if the
 * table is empty). Ordered after DemoUserSeeder and DatacenterSeeder, which this looks up rows
 * from. Dev/demo data only.
 */
@Component
@Order(2)
public class UserDatacenterAssignmentSeeder implements CommandLineRunner {

  private final UserRepository userRepository;
  private final DatacenterRepository datacenterRepository;
  private final UserDatacenterAssignmentRepository assignmentRepository;

  public UserDatacenterAssignmentSeeder(
      UserRepository userRepository,
      DatacenterRepository datacenterRepository,
      UserDatacenterAssignmentRepository assignmentRepository) {
    this.userRepository = userRepository;
    this.datacenterRepository = datacenterRepository;
    this.assignmentRepository = assignmentRepository;
  }

  @Override
  public void run(String... args) {
    if (assignmentRepository.count() > 0) {
      return;
    }

    userRepository
        .findByUsername("dc.admin")
        .ifPresent(
            dcAdmin -> {
              assign(dcAdmin, "DC-CASA-01");
              assign(dcAdmin, "DC-RABAT-01");
            });
  }

  private void assign(User user, String datacenterCode) {
    datacenterRepository
        .findByCodeIgnoreCase(datacenterCode)
        .ifPresent(
            datacenter -> {
              UserDatacenterAssignment assignment = new UserDatacenterAssignment();
              assignment.setUser(user);
              assignment.setDatacenter(datacenter);
              assignment.setCreatedAt(Instant.now());
              assignmentRepository.save(assignment);
            });
  }
}
