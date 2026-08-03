package com.foody.ordertracker.order.dto;

public record DeliveryAddressResponse(
    String street,
    String number,
    String complement,
    String neighborhood,
    String city,
    String state,
    String zipCode
) {
}
