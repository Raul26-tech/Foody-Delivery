package com.foody.ordertracker.order.domain;

import java.util.Set;

public enum OrderStatus {

    RECEBIDO,
    EM_PREPARO,
    SAIU_PARA_ENTREGA,
    ENTREGUE,
    CANCELADO;

    public boolean canTransitionTo(OrderStatus newStatus) {
        if (newStatus == null) {
            return false;
        }

        return switch (this) {
            case RECEBIDO -> Set.of(
                EM_PREPARO,
                CANCELADO
            ).contains(newStatus);

            case EM_PREPARO -> Set.of(
                SAIU_PARA_ENTREGA,
                CANCELADO
            ).contains(newStatus);

            case SAIU_PARA_ENTREGA -> newStatus == ENTREGUE;

            case ENTREGUE, CANCELADO -> false;
        };
    }
}
