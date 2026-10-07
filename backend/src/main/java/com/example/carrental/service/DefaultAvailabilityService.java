package com.example.carrental.service;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Reservation;
import com.example.carrental.model.Vehicle;
import com.example.carrental.repository.ReservationRepository;
import com.example.carrental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DefaultAvailabilityService implements AvailabilityService {

    private final VehicleRepository vehicleRepository;
    private final ReservationRepository reservationRepository;

    public DefaultAvailabilityService(
            VehicleRepository vehicleRepository,
            ReservationRepository reservationRepository
    ) {
        this.vehicleRepository = vehicleRepository;
        this.reservationRepository = reservationRepository;
    }

    @Override
    public List<Vehicle> getAvailableVehicles(
            CarType carType,
            LocalDateTime requestedStartDateTime,
            LocalDate requestedEndDate
    ) {

        validateRequest(requestedStartDateTime, requestedEndDate);

        LocalDateTime requestedEndDateTime = requestedEndDate.atTime(requestedStartDateTime.toLocalTime());

        return vehicleRepository
                .findByCarType(carType)
                .stream()
                .filter(vehicle -> isVehicleAvailable(vehicle, requestedStartDateTime, requestedEndDateTime))
                .toList();
    }

    private boolean isVehicleAvailable(
            Vehicle vehicle,
            LocalDateTime requestedStartDateTime,
            LocalDateTime requestedEndDateTime
    ) {
        List<Reservation> reservations = reservationRepository.findByVehicleId(vehicle.id());

        return reservations.stream()
                .noneMatch(reservation -> overlaps(reservation, requestedStartDateTime, requestedEndDateTime));
    }


    /*
     * Two intervals do NOT overlap when:
     *
     * 1. The requested rental ends before or exactly when the existing reservation starts.
     *
     *    requestedStart ---- requestedEnd
     *                                 reservationStart ---- reservationEnd
     *
     * OR
     *
     * 2. The requested rental starts after or exactly when the existing reservation ends.
     *
     *    reservationStart ---- reservationEnd
     *                                      requestedStart ---- requestedEnd
     *
     * Therefore, the intervals overlap when neither case is true.
     *
     * Strict comparisons allow back-to-back reservations:
     *
     * Existing: 10:00 -------- 13:00
     * New:                     13:00 -------- 16:00
     */
    private boolean overlaps(
            Reservation reservation,
            LocalDateTime requestedStartDateTime,
            LocalDateTime requestedEndDateTime
    ) {
        // Treat the return date as the same time-of-day as the reservation start.
        LocalDateTime reservationEndDateTime = reservation.endDate().atTime(reservation.startDateTime().toLocalTime());

        return requestedStartDateTime.isBefore(reservationEndDateTime)
                && requestedEndDateTime.isAfter(reservation.startDateTime());
    }

    private void validateRequest(
            LocalDateTime requestedStartDateTime,
            LocalDate requestedEndDate
    ) {
        if (requestedStartDateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Start date/time cannot be in the past."
            );
        }

        if (!requestedEndDate.isAfter(requestedStartDateTime.toLocalDate())) {
            throw new IllegalArgumentException(
                    "End date must be after start date."
            );
        }
    }
}