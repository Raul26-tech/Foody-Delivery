package com.foody.ordertracker.order.service;

import java.util.List;
import java.util.UUID;

import com.foody.ordertracker.authentication.security.AuthenticatedUserPrincipal;
import com.foody.ordertracker.order.domain.Order;
import com.foody.ordertracker.order.dto.CreateOrderItemRequest;
import com.foody.ordertracker.order.dto.CreateOrderRequest;
import com.foody.ordertracker.order.dto.OrderResponse;
import com.foody.ordertracker.order.dto.UpdateOrderStatusRequest;
import com.foody.ordertracker.order.mapper.OrderMapper;
import com.foody.ordertracker.order.repository.OrderRepository;
import com.foody.ordertracker.shared.exception.OrderNotFoundException;
import com.foody.ordertracker.user.domain.User;
import com.foody.ordertracker.user.repository.UserRepository;
import com.foody.ordertracker.shared.exception.AuthenticatedUserNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.foody.ordertracker.shared.response.PageResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    public OrderService(
        OrderRepository orderRepository,
        UserRepository userRepository,
        OrderMapper orderMapper
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderMapper = orderMapper;
    }

    @Transactional
    public OrderResponse create(
        CreateOrderRequest request,
        AuthenticatedUserPrincipal principal
    ) {
        User user = userRepository.findById(principal.getId())
            .orElseThrow(() ->
                new AuthenticatedUserNotFoundException(
                    principal.getId()
                )
            );

        Order order = new Order(
            request.customerName(),
            request.deliveryAddress(),
            user
        );

        for (CreateOrderItemRequest item : request.items()) {
            order.addItem(
                item.description(),
                item.quantity(),
                item.unitPrice()
            );
        }

        Order savedOrder = orderRepository.save(order);

        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> findAll(Pageable pageable) {
        Page<OrderResponse> orders = orderRepository
            .findAll(pageable)
            .map(orderMapper::toResponse);

        return PageResponse.from(orders);
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(UUID orderId) {
        Order order = findOrder(orderId);

        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(
        UUID orderId,
        UpdateOrderStatusRequest request
    ) {
        Order order = findOrder(orderId);

        order.updateStatus(request.status());

        return orderMapper.toResponse(order);
    }

    private Order findOrder(UUID orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() ->
                new OrderNotFoundException(orderId)
            );
    }
}
