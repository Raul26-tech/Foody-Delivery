package com.foody.ordertracker.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateDeliveryAddressRequest(

    @NotBlank(message = "Street is required")
    @Size(
        max = 150,
        message = "Street must contain at most 150 characters"
    )
    String street,

    @NotBlank(message = "Address number is required")
    @Size(
        max = 30,
        message = "Address number must contain at most 30 characters"
    )
    String number,

    @Size(
        max = 100,
        message = "Complement must contain at most 100 characters"
    )
    String complement,

    @NotBlank(message = "Neighborhood is required")
    @Size(
        max = 100,
        message = "Neighborhood must contain at most 100 characters"
    )
    String neighborhood,

    @NotBlank(message = "City is required")
    @Size(
        max = 100,
        message = "City must contain at most 100 characters"
    )
    String city,

    @NotBlank(message = "State is required")
    @Pattern(
        regexp = "^[A-Za-z]{2}$",
        message = "State must contain exactly 2 letters"
    )
    String state,

    @Size(
        max = 10,
        message = "ZIP code must contain at most 10 characters"
    )
    String zipCode
) {
}
