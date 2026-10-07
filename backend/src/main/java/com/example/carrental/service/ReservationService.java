package com.example.carrental.service;

import com.example.carrental.model.Reservation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReservationService {

    Reservation reserve(
            UUID vehicleId,
            LocalDateTime startDateTime,
            LocalDate endDate
    );

    List<Reservation> getReservations();

    void deleteReservations();
}