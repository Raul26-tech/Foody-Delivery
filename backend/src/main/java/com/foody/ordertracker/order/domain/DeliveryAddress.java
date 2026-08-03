package com.foody.ordertracker.order.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class DeliveryAddress {

    @Column(name = "delivery_street", nullable = false, length = 150)
    private String street;

    @Column(name = "delivery_number", nullable = false, length = 30)
    private String number;

    @Column(name = "delivery_complement", length = 100)
    private String complement;

    @Column(name = "delivery_neighborhood", nullable = false, length = 100)
    private String neighborhood;

    @Column(name = "delivery_city", nullable = false, length = 100)
    private String city;

    @Column(name = "delivery_state", nullable = false, length = 2)
    private String state;

    @Column(name = "delivery_zip_code", length = 10)
    private String zipCode;

    protected DeliveryAddress() {
    }

    public DeliveryAddress(
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state,
        String zipCode
    ) {
        this.street = requireText(street, "street");
        this.number = requireText(number, "number");
        this.complement = normalizeOptionalText(complement);
        this.neighborhood = requireText(
            neighborhood,
            "neighborhood"
        );
        this.city = requireText(city, "city");
        this.state = requireState(state);
        this.zipCode = normalizeOptionalText(zipCode);
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

    private static String normalizeOptionalText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private static String requireState(String state) {
        String normalizedState = requireText(
            state,
            "state"
        ).toUpperCase();

        if (normalizedState.length() != 2) {
            throw new IllegalArgumentException(
                "state must contain exactly 2 characters"
            );
        }

        return normalizedState;
    }

    public String getStreet() {
        return street;
    }

    public String getNumber() {
        return number;
    }

    public String getComplement() {
        return complement;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }
}
