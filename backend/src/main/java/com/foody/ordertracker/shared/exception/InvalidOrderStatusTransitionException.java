package com.foody.ordertracker.shared.exception;

import com.foody.ordertracker.order.domain.OrderStatus;

public class InvalidOrderStatusTransitionException extends RuntimeException {

    public InvalidOrderStatusTransitionException(
            OrderStatus currentStatus,
            OrderStatus newStatus
    ) {
        super(
                "Order status cannot transition from %s to %s"
                        .formatted(currentStatus, newStatus)
        );
    }
}