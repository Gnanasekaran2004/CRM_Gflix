package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername("admin").orElse(new User());

            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRoles("ADMIN");

            userRepository.save(admin);
            System.out.println("Admin user initialized: admin / password123");

            
            if (userRepository.findByUsername("gs").isEmpty()) {
                User gsUser = new User();
                gsUser.setUsername("gs");
                gsUser.setPassword(passwordEncoder.encode("G25anase25karan@"));
                gsUser.setRoles("ADMIN2");
                userRepository.save(gsUser);
                System.out.println("User initialized: gs / G25anase25karan@");
            }
        };
    }
}
