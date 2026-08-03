package com.foody.ordertracker.order.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(

    @NotBlank(message = "Customer name is required")
    @Size(
        max = 120,
        message = "Customer name must contain at most 120 characters"
    )
    String customerName,

    @NotBlank(message = "Customer phone is required")
    @Size(
        max = 20,
        message = "Customer phone must contain at most 20 characters"
    )
    String customerPhone,

    @Email(message = "Customer email must be valid")
    @Size(
        max = 180,
        message = "Customer email must contain at most 180 characters"
    )
    String customerEmail,

    @NotNull(message = "Delivery address is required")
    @Valid
    CreateDeliveryAddressRequest deliveryAddress,

    @NotEmpty(message = "Order must contain at least one item")
    List<@Valid CreateOrderItemRequest> items
) {
}
