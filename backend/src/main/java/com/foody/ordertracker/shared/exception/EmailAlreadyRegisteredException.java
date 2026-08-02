package com.foody.ordertracker.shared.exception;

public class EmailAlreadyRegisteredException extends RuntimeException {

    public EmailAlreadyRegisteredException() {
        super("An account with the provided credentials cannot be created");
    }
}
