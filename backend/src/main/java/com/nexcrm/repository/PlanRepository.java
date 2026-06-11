package com.nexcrm.repository;

import com.nexcrm.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByActiveTrue();
    java.util.Optional<Plan> findByName(String name);
}
