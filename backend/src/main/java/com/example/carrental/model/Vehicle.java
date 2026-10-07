package com.example.carrental.model;

import java.util.UUID;

public record Vehicle(
        UUID id,
        CarType carType
) {
}