package com.example.carrental.controller;

import com.example.carrental.model.Reservation;
import com.example.carrental.model.Vehicle;
import com.example.carrental.repository.VehicleRepository;
import com.example.carrental.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final VehicleRepository vehicleRepository;

    public ReservationController(
            ReservationService reservationService,
            VehicleRepository vehicleRepository
    ) {
        this.reservationService = reservationService;
        this.vehicleRepository = vehicleRepository;
    }

    @GetMapping
    public ReservationsResponse getReservations() {
        List<ReservationResponse> reservations =
                reservationService
                        .getReservations()
                        .stream()
                        .map(this::toReservationResponse)
                        .toList();

        return new ReservationsResponse(
                reservations
        );
    }

    @PostMapping
    public ReservationResponse createReservation(
            @RequestBody CreateReservationRequest request
    ) {
        Reservation reservation =
                reservationService.reserve(
                        request.vehicleId(),
                        request.startDateTime(),
                        request.endDate()
                );

        return toReservationResponse(reservation);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteReservations() {
        reservationService.deleteReservations();

        return ResponseEntity.noContent().build();
    }

    private ReservationResponse toReservationResponse(
            Reservation reservation
    ) {
        Vehicle vehicle =
                vehicleRepository
                        .findById(reservation.vehicleId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Vehicle not found."
                                )
                        );

        long numberOfDays = ChronoUnit.DAYS.between(
                reservation.startDateTime().toLocalDate(),
                reservation.endDate()
        );

        return new ReservationResponse(
                reservation.id(),
                reservation.vehicleId(),
                vehicle.carType().name(),
                reservation.startDateTime(),
                reservation.endDate(),
                numberOfDays
        );
    }

    public record CreateReservationRequest(
            UUID vehicleId,
            LocalDateTime startDateTime,
            LocalDate endDate
    ) {
    }

    public record ReservationsResponse(
            List<ReservationResponse> reservations
    ) {
    }

    public record ReservationResponse(
            UUID id,
            UUID vehicleId,
            String carType,
            LocalDateTime startDateTime,
            LocalDate endDate,
            long numberOfDays
    ) {
    }
}