package com.foody.ordertracker.order.repository;

import java.util.Optional;
import java.util.UUID;

import com.foody.ordertracker.order.domain.Order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Override
    @EntityGraph(attributePaths = {"items", "createdBy"})
    Optional<Order> findById(UUID id);
}
