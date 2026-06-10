package com.nexcrm.repository;

import com.nexcrm.entity.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccessRequestRepository extends JpaRepository<AccessRequest, Long> {
    List<AccessRequest> findByStatusOrderByCreatedAtDesc(AccessRequest.RequestStatus status);
    List<AccessRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(AccessRequest.RequestStatus status);
    boolean existsByEmail(String email);
}
