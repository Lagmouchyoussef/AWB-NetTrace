package com.awb.backend.core.repository;

import com.awb.backend.core.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

  Optional<User> findByUsername(String username);

  boolean existsByUsernameIgnoreCase(String username);

  boolean existsByUsernameIgnoreCaseAndIdNot(String username, Long id);
}
