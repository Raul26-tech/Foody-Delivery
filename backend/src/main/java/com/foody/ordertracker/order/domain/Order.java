package com.foody.ordertracker.order.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import com.foody.ordertracker.shared.exception.InvalidOrderStatusTransitionException;
import com.foody.ordertracker.user.domain.User;

import java.math.BigDecimal;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Embedded;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private UUID id;

    @Column(name = "customer_name", nullable = false, length = 120)
    private String customerName;

    @Column(
        name = "customer_phone",
        nullable = false,
        length = 20
    )
    private String customerPhone;

    @Column(
        name = "customer_email",
        length = 180
    )
    private String customerEmail;

    @Embedded
    private DeliveryAddress deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(
        mappedBy = "order",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Order() {
    }

    public Order(
        String customerName,
        String customerPhone,
        String customerEmail,
        DeliveryAddress deliveryAddress,
        User createdBy
    ) {
        this.id = UUID.randomUUID();

        this.customerName = requireText(
            customerName,
            "customerName"
        );

        this.customerPhone = requireText(
            customerPhone,
            "customerPhone"
        );

        this.customerEmail = normalizeOptionalText(
            customerEmail
        );

        this.deliveryAddress =
            requireDeliveryAddress(deliveryAddress);

        this.createdBy = requireUser(createdBy);
        this.status = OrderStatus.RECEBIDO;
    }

    private static String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private static DeliveryAddress requireDeliveryAddress(
        DeliveryAddress deliveryAddress
    ) {
        if (deliveryAddress == null) {
            throw new IllegalArgumentException(
                "deliveryAddress must not be null"
            );
        }

        return deliveryAddress;
    }

    public void addItem(
        String description,
        int quantity,
        BigDecimal unitPrice
    ) {
        items.add(
            new OrderItem(
                description,
                quantity,
                unitPrice,
                this
            )
        );
    }

    public void updateStatus(OrderStatus newStatus) {
        if (!status.canTransitionTo(newStatus)) {
            throw new InvalidOrderStatusTransitionException(
                status,
                newStatus
            );
        }

        status = newStatus;
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();

        if (id == null) {
            id = UUID.randomUUID();
        }

        if (status == null) {
            status = OrderStatus.RECEBIDO;
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    private static String requireText(
        String value,
        String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                field + " must not be blank"
            );
        }

        return value.trim();
    }

    private static User requireUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException(
                "createdBy must not be null"
            );
        }

        return user;
    }

    public BigDecimal calculateTotal() {
        return items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void validateForCreation() {
        if (items.isEmpty()) {
            throw new IllegalStateException(
                "Order must contain at least one item"
            );
        }
    }

    public UUID getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public DeliveryAddress getDeliveryAddress() {
        return deliveryAddress;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
