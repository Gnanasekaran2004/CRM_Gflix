package com.pulsestream.controller;

import com.pulsestream.entity.Plan;
import com.pulsestream.repository.PlanRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final PlanRepository planRepository;

    public PlanController(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @GetMapping
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    @GetMapping("/active")
    public List<Plan> getActivePlans() {
        return planRepository.findByActiveTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
        return planRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Plan> createPlan(@RequestBody Plan plan) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planRepository.save(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plan> updatePlan(@PathVariable Long id, @RequestBody Plan details) {
        return planRepository.findById(id)
                .map(plan -> {
                    plan.setName(details.getName());
                    plan.setDescription(details.getDescription());
                    plan.setMonthlyPrice(details.getMonthlyPrice());
                    plan.setAnnualPrice(details.getAnnualPrice());
                    plan.setMaxScreens(details.getMaxScreens());
                    plan.setVideoQuality(details.getVideoQuality());
                    plan.setDownloadAllowed(details.isDownloadAllowed());
                    plan.setActive(details.isActive());
                    return ResponseEntity.ok(planRepository.save(plan));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        if (!planRepository.existsById(id)) return ResponseEntity.notFound().build();
        planRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
