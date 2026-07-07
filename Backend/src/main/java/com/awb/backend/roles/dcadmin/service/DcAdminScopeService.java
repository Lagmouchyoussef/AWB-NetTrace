package com.awb.backend.roles.dcadmin.service;

import com.awb.backend.core.dto.DatacenterScopeResponse;
import com.awb.backend.core.entity.Datacenter;
import com.awb.backend.core.entity.User;
import com.awb.backend.core.entity.UserDatacenterAssignment;
import com.awb.backend.core.repository.UserDatacenterAssignmentRepository;
import com.awb.backend.core.repository.UserRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// Resolves the authenticated DC Admin's datacenter assignments - the data-tenancy boundary for
// every DC Admin-scoped read/write, not just a permission tier. Kept as one small lookup service
// rather than duplicating the Authentication -> User -> assignments resolution in every
// DcAdmin controller. Maps to DTOs inside the transactional method (like every other *Service
// in this codebase) since Datacenter is a lazy association here and open-in-view is disabled.
@Service
public class DcAdminScopeService {

  private final UserRepository userRepository;
  private final UserDatacenterAssignmentRepository assignmentRepository;

  public DcAdminScopeService(
      UserRepository userRepository, UserDatacenterAssignmentRepository assignmentRepository) {
    this.userRepository = userRepository;
    this.assignmentRepository = assignmentRepository;
  }

  @Transactional(readOnly = true)
  public List<DatacenterScopeResponse> getAssignedDatacenters(Authentication authentication) {
    User user = resolveUser(authentication);
    return assignmentRepository.findByUserId(user.getId()).stream()
        .map(UserDatacenterAssignment::getDatacenter)
        .map(DcAdminScopeService::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public Set<Long> getAssignedDatacenterIds(Authentication authentication) {
    User user = resolveUser(authentication);
    return assignmentRepository.findByUserId(user.getId()).stream()
        .map(assignment -> assignment.getDatacenter().getId())
        .collect(Collectors.toSet());
  }

  private User resolveUser(Authentication authentication) {
    return userRepository
        .findByUsername(authentication.getName())
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found."));
  }

  private static DatacenterScopeResponse toResponse(Datacenter datacenter) {
    DatacenterScopeResponse response = new DatacenterScopeResponse();
    response.setId(datacenter.getId());
    response.setName(datacenter.getName());
    response.setCode(datacenter.getCode());
    return response;
  }
}
