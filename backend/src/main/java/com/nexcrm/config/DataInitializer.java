package com.nexcrm.config;

import com.nexcrm.entity.*;
import com.nexcrm.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            UserRepository userRepository,
            CustomerRepository customerRepository,
            PlanRepository planRepository,
            AccessRequestRepository requestRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            // ==========================================
            // 1. Create Subscription Plans
            // ==========================================
            Plan basic = planRepository.save(Plan.builder()
                    .name("Basic").description("Stream on 1 device in HD quality")
                    .monthlyPrice(8.99).annualPrice(89.99).maxScreens(1)
                    .videoQuality("HD").downloadAllowed(false).offlineViewing(false).build());

            Plan standard = planRepository.save(Plan.builder()
                    .name("Standard").description("Stream on 2 devices in Full HD quality")
                    .monthlyPrice(13.99).annualPrice(139.99).maxScreens(2)
                    .videoQuality("Full HD").downloadAllowed(true).offlineViewing(false).build());

            Plan premium = planRepository.save(Plan.builder()
                    .name("Premium").description("Stream on 4 devices in 4K + HDR quality")
                    .monthlyPrice(17.99).annualPrice(179.99).maxScreens(4)
                    .videoQuality("4K + HDR").downloadAllowed(true).offlineViewing(true).build());

            // ==========================================
            // 2. Create Admin Users
            // ==========================================
            userRepository.save(User.builder()
                    .username("admin").email("admin@nexcrm.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Super Admin").role(User.Role.SUPER_ADMIN)
                    .department("Management").build());

            userRepository.save(User.builder()
                    .username("agent1").email("agent@nexcrm.com")
                    .password(passwordEncoder.encode("agent123"))
                    .fullName("Alex Johnson").role(User.Role.CRM_AGENT)
                    .department("Sales").build());

            userRepository.save(User.builder()
                    .username("support1").email("support@nexcrm.com")
                    .password(passwordEncoder.encode("support123"))
                    .fullName("Sam Rivera").role(User.Role.SUPPORT_REP)
                    .department("Customer Support").build());

            // ==========================================
            // 3. Create Sample Customers
            // ==========================================
            List<Customer> customers = List.of(
                Customer.builder().name("Emma Wilson").email("emma@techcorp.com")
                    .phone("+1-555-0101").company("TechCorp Inc.").password(passwordEncoder.encode("pass123"))
                    .plan(premium).subscriptionStatus(Customer.SubscriptionStatus.ACTIVE)
                    .pipelineStage("ACTIVE").billingCycle(Customer.BillingCycle.ANNUAL)
                    .country("USA").city("San Francisco")
                    .subscriptionStartDate(LocalDateTime.now().minusMonths(6)).build(),

                Customer.builder().name("Liam Martinez").email("liam@designco.io")
                    .phone("+1-555-0202").company("DesignCo").password(passwordEncoder.encode("pass123"))
                    .plan(standard).subscriptionStatus(Customer.SubscriptionStatus.ACTIVE)
                    .pipelineStage("ACTIVE").billingCycle(Customer.BillingCycle.MONTHLY)
                    .country("USA").city("New York")
                    .subscriptionStartDate(LocalDateTime.now().minusMonths(3)).build(),

                Customer.builder().name("Olivia Chen").email("olivia@fintech.co")
                    .phone("+44-20-5555-0303").company("FinTech Solutions").password(passwordEncoder.encode("pass123"))
                    .plan(premium).subscriptionStatus(Customer.SubscriptionStatus.ACTIVE)
                    .pipelineStage("ACTIVE").billingCycle(Customer.BillingCycle.ANNUAL)
                    .country("UK").city("London")
                    .subscriptionStartDate(LocalDateTime.now().minusMonths(8)).build(),

                Customer.builder().name("Noah Kim").email("noah@startupx.io")
                    .phone("+82-2-5555-0404").company("StartupX").password(passwordEncoder.encode("pass123"))
                    .plan(basic).subscriptionStatus(Customer.SubscriptionStatus.TRIAL)
                    .pipelineStage("TRIAL").billingCycle(Customer.BillingCycle.MONTHLY)
                    .country("South Korea").city("Seoul")
                    .subscriptionStartDate(LocalDateTime.now().minusDays(10)).build(),

                Customer.builder().name("Ava Patel").email("ava@mediahouse.in")
                    .phone("+91-98-5555-0505").company("MediaHouse").password(passwordEncoder.encode("pass123"))
                    .plan(standard).subscriptionStatus(Customer.SubscriptionStatus.TRIAL)
                    .pipelineStage("TRIAL").billingCycle(Customer.BillingCycle.MONTHLY)
                    .country("India").city("Mumbai")
                    .subscriptionStartDate(LocalDateTime.now().minusDays(5)).build(),

                Customer.builder().name("James Walker").email("james@globalent.com")
                    .phone("+1-555-0606").company("Global Entertainment").password(passwordEncoder.encode("pass123"))
                    .plan(premium).subscriptionStatus(Customer.SubscriptionStatus.CHURNED)
                    .pipelineStage("CHURNED").billingCycle(Customer.BillingCycle.MONTHLY)
                    .country("Canada").city("Toronto")
                    .notes("Cancelled due to pricing concerns. Follow up in Q3.")
                    .subscriptionStartDate(LocalDateTime.now().minusMonths(12)).build(),

                Customer.builder().name("Sophia Brown").email("sophia@creativeagency.com")
                    .phone("+1-555-0707").company("Creative Agency").password(passwordEncoder.encode("pass123"))
                    .plan(standard).subscriptionStatus(Customer.SubscriptionStatus.ACTIVE)
                    .pipelineStage("ACTIVE").billingCycle(Customer.BillingCycle.ANNUAL)
                    .country("USA").city("Los Angeles")
                    .subscriptionStartDate(LocalDateTime.now().minusMonths(4)).build(),

                Customer.builder().name("Lucas Schmidt").email("lucas@techberlin.de")
                    .phone("+49-30-5555-0808").company("TechBerlin GmbH").password(passwordEncoder.encode("pass123"))
                    .plan(basic).subscriptionStatus(Customer.SubscriptionStatus.TRIAL)
                    .pipelineStage("LEAD").billingCycle(Customer.BillingCycle.MONTHLY)
                    .country("Germany").city("Berlin")
                    .subscriptionStartDate(LocalDateTime.now().minusDays(2)).build()
            );

            customerRepository.saveAll(customers);

            // ==========================================
            // 4. Create Sample Access Requests
            // ==========================================
            requestRepository.save(AccessRequest.builder()
                    .name("Diana Ross").email("diana@newco.com").phone("+1-555-0901")
                    .company("NewCo Ltd").password(passwordEncoder.encode("password123"))
                    .requestedPlan(premium).status(AccessRequest.RequestStatus.PENDING).build());

            requestRepository.save(AccessRequest.builder()
                    .name("Carlos Gomez").email("carlos@mediaplus.mx").phone("+52-55-5555-1001")
                    .company("Media Plus").password(passwordEncoder.encode("password123"))
                    .requestedPlan(standard).status(AccessRequest.RequestStatus.PENDING).build());

            requestRepository.save(AccessRequest.builder()
                    .name("Yuki Tanaka").email("yuki@streamjp.co.jp").phone("+81-3-5555-1101")
                    .company("StreamJP").password(passwordEncoder.encode("password123"))
                    .requestedPlan(basic).status(AccessRequest.RequestStatus.PENDING).build());

            System.out.println("\n====================================");
            System.out.println("  NexCRM Data Seeded Successfully!");
            System.out.println("  Admin Login: admin / admin123");
            System.out.println("  H2 Console:  http://localhost:8080/h2-console");
            System.out.println("====================================\n");
        };
    }
}
