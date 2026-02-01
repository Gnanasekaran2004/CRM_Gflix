package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.CustomerRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public CustomUserDetailsService(UserRepository userRepository, CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        java.util.Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                    .password(user.getPassword())
                    .roles(user.getRoles().split(","))
                    .build();
        }

        java.util.Optional<com.example.demo.entity.Customer> customerOpt = customerRepository.findByEmail(username);
        if (customerOpt.isPresent()) {
            com.example.demo.entity.Customer customer = customerOpt.get();
            return org.springframework.security.core.userdetails.User.withUsername(customer.getEmail())
                    .password(customer.getPassword())
                    .roles("CUSTOMER") 
                    .build();
        }

        throw new UsernameNotFoundException("User/Customer not found with username/email: " + username);
    }
}
