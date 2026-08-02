package com.foody.ordertracker.order.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(

    @NotBlank(message = "Customer name is required")
    @Size(
        max = 120,
        message = "Customer name must contain at most 120 characters"
    )
    String customerName,

    @NotBlank(message = "Delivery address is required")
    @Size(
        max = 300,
        message = "Delivery address must contain at most 300 characters"
    )
    String deliveryAddress,

    @NotEmpty(message = "Order must contain at least one item")
    List<@Valid CreateOrderItemRequest> items
) {
}
