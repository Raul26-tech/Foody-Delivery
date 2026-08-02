package com.foody.ordertracker.order.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateOrderItemRequest(

    @NotBlank(message = "Item description is required")
    @Size(
        max = 200,
        message = "Item description must contain at most 200 characters"
    )
    String description,

    @Min(
        value = 1,
        message = "Item quantity must be greater than zero"
    )
    int quantity,

    @NotNull(message = "Item unit price is required")
    @DecimalMin(
        value = "0.01",
        message = "Item unit price must be greater than zero"
    )
    @Digits(
        integer = 10,
        fraction = 2,
        message = "Item unit price must contain at most 10 integer digits and 2 decimal places"
    )
    BigDecimal unitPrice
) {
}
