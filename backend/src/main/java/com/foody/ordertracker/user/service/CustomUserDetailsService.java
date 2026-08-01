package com.foody.ordertracker.user.service;

import com.foody.ordertracker.authentication.security.AuthenticatedUserPrincipal;
import com.foody.ordertracker.user.domain.User;
import com.foody.ordertracker.user.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        User user = userRepository
            .findByEmail(normalizedEmail)
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    "User not found"
                )
            );

        return new AuthenticatedUserPrincipal(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPasswordHash()
        );
    }
}
