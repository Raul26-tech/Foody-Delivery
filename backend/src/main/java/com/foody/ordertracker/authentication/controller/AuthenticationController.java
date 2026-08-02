package com.foody.ordertracker.authentication.controller;

import com.foody.ordertracker.authentication.dto.AuthenticatedUserResponse;
import com.foody.ordertracker.authentication.dto.LoginRequest;
import com.foody.ordertracker.authentication.dto.RegisterUserRequest;
import com.foody.ordertracker.authentication.security.AuthenticatedUserPrincipal;
import com.foody.ordertracker.authentication.service.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(
        AuthenticationService authenticationService
    ) {
        this.authenticationService = authenticationService;
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken csrfToken) {
        return csrfToken;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticatedUserResponse> register(
        @Valid @RequestBody RegisterUserRequest request
    ) {
        AuthenticatedUserResponse response =
            authenticationService.register(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticatedUserResponse> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletRequest httpRequest,
        HttpServletResponse httpResponse
    ) {
        return ResponseEntity.ok(
            authenticationService.login(
                request,
                httpRequest,
                httpResponse
            )
        );
    }

    @GetMapping("/me")
    public ResponseEntity<AuthenticatedUserResponse> me(
        @AuthenticationPrincipal
        AuthenticatedUserPrincipal principal
    ) {
        return ResponseEntity.ok(
            AuthenticatedUserResponse.from(principal)
        );
    }
}
