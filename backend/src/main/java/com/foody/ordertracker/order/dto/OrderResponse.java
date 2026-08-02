package com.foody.ordertracker.order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.foody.ordertracker.order.domain.OrderStatus;

public record OrderResponse(
    UUID id,
    String customerName,
    String deliveryAddress,
    OrderStatus status,
    List<OrderItemResponse> items,
    BigDecimal total,
    UUID createdBy,
    Instant createdAt,
    Instant updatedAt
) {
}
