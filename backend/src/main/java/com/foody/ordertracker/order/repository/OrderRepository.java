package com.foody.ordertracker.order.repository;

import java.util.List;
import java.util.UUID;

import com.foody.ordertracker.order.domain.Order;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findAllByOrderByCreatedAtDesc();
}