package com.foody.ordertracker.order.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import com.foody.ordertracker.authentication.security.AuthenticatedUserPrincipal;
import com.foody.ordertracker.order.dto.CreateOrderRequest;
import com.foody.ordertracker.order.dto.OrderResponse;
import com.foody.ordertracker.order.dto.UpdateOrderStatusRequest;
import com.foody.ordertracker.order.service.OrderService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestParam;
import com.foody.ordertracker.shared.response.PageResponse;

@Validated
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(
        @Valid @RequestBody CreateOrderRequest request,
        @AuthenticationPrincipal
        AuthenticatedUserPrincipal principal
    ) {
        OrderResponse response =
            orderService.create(request, principal);

        return ResponseEntity
            .created(
                URI.create("/api/orders/" + response.id())
            )
            .body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> findAll(
        @RequestParam(defaultValue = "0")
        @Min(value = 0, message = "Page must not be negative")
        int page,

        @RequestParam(defaultValue = "20")
        @Min(value = 1, message = "Page size must be at least 1")
        @Max(value = 50, message = "Page size must not exceed 50")
        int size
    ) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(
                Sort.Direction.DESC,
                "createdAt"
            )
        );

        return ResponseEntity.ok(
            orderService.findAll(pageable)
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> findById(
        @PathVariable UUID orderId
    ) {
        return ResponseEntity.ok(
            orderService.findById(orderId)
        );
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateStatus(
        @PathVariable UUID orderId,
        @Valid @RequestBody
        UpdateOrderStatusRequest request
    ) {
        return ResponseEntity.ok(
            orderService.updateStatus(
                orderId,
                request
            )
        );
    }
}
