package com.foody.ordertracker.order.mapper;

import java.util.List;

import com.foody.ordertracker.order.domain.DeliveryAddress;
import com.foody.ordertracker.order.dto.DeliveryAddressResponse;
import com.foody.ordertracker.order.domain.Order;
import com.foody.ordertracker.order.domain.OrderItem;
import com.foody.ordertracker.order.dto.OrderItemResponse;
import com.foody.ordertracker.order.dto.OrderResponse;

import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems()
            .stream()
            .map(this::toItemResponse)
            .toList();

        return new OrderResponse(
            order.getId(),
            order.getCustomerName(),
            order.getCustomerPhone(),
            order.getCustomerEmail(),
            toAddressResponse(order.getDeliveryAddress()),
            order.getStatus(),
            items,
            order.calculateTotal(),
            order.getCreatedBy().getId(),
            order.getCreatedAt(),
            order.getUpdatedAt()
        );
    }

    private DeliveryAddressResponse toAddressResponse(
        DeliveryAddress address
    ) {
        return new DeliveryAddressResponse(
            address.getStreet(),
            address.getNumber(),
            address.getComplement(),
            address.getNeighborhood(),
            address.getCity(),
            address.getState(),
            address.getZipCode()
        );
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return new OrderItemResponse(
            item.getId(),
            item.getDescription(),
            item.getQuantity(),
            item.getUnitPrice(),
            item.getSubtotal()
        );
    }
}
