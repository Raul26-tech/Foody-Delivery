package com.foody.ordertracker.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(
    UUID id,
    String description,
    int quantity,
    BigDecimal unitPrice,
    BigDecimal subtotal
) {
}
