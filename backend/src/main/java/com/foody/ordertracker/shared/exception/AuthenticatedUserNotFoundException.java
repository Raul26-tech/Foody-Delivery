package com.foody.ordertracker.shared.exception;

import java.util.UUID;

public class AuthenticatedUserNotFoundException
    extends RuntimeException {

    public AuthenticatedUserNotFoundException(UUID userId) {
        super("Authenticated user not found with id: " + userId);
    }
}
