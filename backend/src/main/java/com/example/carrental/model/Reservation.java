package com.example.carrental.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record Reservation(
        UUID id,
        UUID vehicleId,
        LocalDateTime startDateTime,
        LocalDate endDate
) {
}