package com.foody.ordertracker.authentication.service;

import com.foody.ordertracker.authentication.dto.AuthenticatedUserResponse;
import com.foody.ordertracker.authentication.dto.LoginRequest;
import com.foody.ordertracker.authentication.dto.RegisterUserRequest;
import com.foody.ordertracker.authentication.security.AuthenticatedUserPrincipal;
import com.foody.ordertracker.shared.exception.EmailAlreadyRegisteredException;
import com.foody.ordertracker.user.domain.User;
import com.foody.ordertracker.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final SessionAuthenticationStrategy sessionAuthenticationStrategy;

    public AuthenticationService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        SecurityContextRepository securityContextRepository,
        SessionAuthenticationStrategy sessionAuthenticationStrategy
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.sessionAuthenticationStrategy = sessionAuthenticationStrategy;
    }

    @Transactional
    public AuthenticatedUserResponse register(
        RegisterUserRequest request
    ) {
        String normalizedEmail = normalizeEmail(request.email());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyRegisteredException(normalizedEmail);
        }

        User user = new User(
            request.name(),
            normalizedEmail,
            passwordEncoder.encode(request.password())
        );

        User savedUser = userRepository.save(user);

        return AuthenticatedUserResponse.from(savedUser);
    }

    public AuthenticatedUserResponse login(
        LoginRequest request,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse
    ) {
        String normalizedEmail = normalizeEmail(request.email());

        Authentication authentication =
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                    normalizedEmail,
                    request.password()
                )
            );

        sessionAuthenticationStrategy.onAuthentication(
            authentication,
            httpRequest,
            httpResponse
        );

        SecurityContext securityContext =
            SecurityContextHolder.createEmptyContext();

        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);

        securityContextRepository.saveContext(
            securityContext,
            httpRequest,
            httpResponse
        );

        AuthenticatedUserPrincipal principal =
            (AuthenticatedUserPrincipal) authentication.getPrincipal();

        return AuthenticatedUserResponse.from(principal);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
