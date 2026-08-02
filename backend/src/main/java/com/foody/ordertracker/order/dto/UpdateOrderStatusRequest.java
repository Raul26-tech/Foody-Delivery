package com.foody.ordertracker.order.dto;

import com.foody.ordertracker.order.domain.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(

    @NotNull(message = "Order status is required")
    OrderStatus status
) {
}
