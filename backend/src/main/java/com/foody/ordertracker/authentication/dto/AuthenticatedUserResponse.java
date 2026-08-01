package com.foody.ordertracker.authentication.dto;

import java.util.UUID;

import com.foody.ordertracker.authentication.security.AuthenticatedUserPrincipal;
import com.foody.ordertracker.user.domain.User;

public record AuthenticatedUserResponse(
    UUID id,
    String name,
    String email
) {

    public static AuthenticatedUserResponse from(User user) {
        return new AuthenticatedUserResponse(
            user.getId(),
            user.getName(),
            user.getEmail()
        );
    }

    public static AuthenticatedUserResponse from(
        AuthenticatedUserPrincipal principal
    ) {
        return new AuthenticatedUserResponse(
            principal.getId(),
            principal.getName(),
            principal.getEmail()
        );
    }
}
