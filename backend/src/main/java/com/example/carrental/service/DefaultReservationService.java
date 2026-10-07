package com.example.carrental.service;

import com.example.carrental.model.Reservation;
import com.example.carrental.model.Vehicle;
import com.example.carrental.repository.ReservationRepository;
import com.example.carrental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DefaultReservationService implements ReservationService {

    private final AvailabilityService availabilityService;
    private final VehicleRepository vehicleRepository;
    private final ReservationRepository reservationRepository;

    public DefaultReservationService(
            AvailabilityService availabilityService,
            VehicleRepository vehicleRepository,
            ReservationRepository reservationRepository
    ) {
        this.availabilityService = availabilityService;
        this.vehicleRepository = vehicleRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    public synchronized Reservation reserve(
            UUID vehicleId,
            LocalDateTime startDateTime,
            LocalDate endDate
    ) {
        Vehicle vehicle = vehicleRepository
                .findById(vehicleId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Vehicle not found."
                        )
                );

        List<Vehicle> availableVehicles =
                availabilityService.getAvailableVehicles(
                        vehicle.carType(),
                        startDateTime,
                        endDate
                );

        boolean isAvailable =
                availableVehicles.stream()
                        .anyMatch(availableVehicle ->
                                availableVehicle.id().equals(vehicleId)
                        );

        if (!isAvailable) {
            throw new IllegalStateException(
                    "Vehicle is no longer available."
            );
        }

        Reservation reservation = new Reservation(
                UUID.randomUUID(),
                vehicleId,
                startDateTime,
                endDate
        );

        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public void deleteReservations() {
        reservationRepository.deleteAll();
    }
}