package com.foody.ordertracker.order.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    private UUID id;

    @Column(nullable = false, length = 200)
    private String description;

    @Column(nullable = false)
    private int quantity;

    @Column(
            name = "unit_price",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal unitPrice;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    protected OrderItem() {
    }

    OrderItem(
            String description,
            int quantity,
            BigDecimal unitPrice,
            Order order
    ) {
        this.id = UUID.randomUUID();
        this.description = requireDescription(description);
        this.quantity = requirePositiveQuantity(quantity);
        this.unitPrice = requirePositivePrice(unitPrice);
        this.order = requireOrder(order);
    }

    @PrePersist
    void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }

    private static String requireDescription(String description) {
        if (description == null || description.isBlank()) {
            throw new IllegalArgumentException(
                    "description must not be blank"
            );
        }

        return description.trim();
    }

    private static int requirePositiveQuantity(int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException(
                    "quantity must be greater than zero"
            );
        }

        return quantity;
    }

    private static BigDecimal requirePositivePrice(
            BigDecimal unitPrice
    ) {
        if (unitPrice == null) {
            throw new IllegalArgumentException(
                    "unitPrice must not be null"
            );
        }

        if (unitPrice.signum() <= 0) {
            throw new IllegalArgumentException(
                    "unitPrice must be greater than zero"
            );
        }

        return unitPrice.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }

    private static Order requireOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException(
                    "order must not be null"
            );
        }

        return order;
    }

    public UUID getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getSubtotal() {
        return unitPrice
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(2, RoundingMode.HALF_UP);
    }
}