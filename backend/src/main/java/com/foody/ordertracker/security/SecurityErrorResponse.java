package com.foody.ordertracker.security;

import java.time.Instant;

public record SecurityErrorResponse(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path
) {
}
