package com.example.carrental.repository;

import com.example.carrental.model.Reservation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryReservationRepository implements ReservationRepository {

    private static final Logger logger =
            LoggerFactory.getLogger(InMemoryReservationRepository.class);

    private final Map<UUID, List<Reservation>> reservationsByVehicleId =
            new ConcurrentHashMap<>();

    @Override
    public List<Reservation> findAll() {
        return reservationsByVehicleId
                .values()
                .stream()
                .flatMap(List::stream)
                .toList();
    }

    @Override
    public List<Reservation> findByVehicleId(UUID vehicleId) {
        return reservationsByVehicleId.getOrDefault(
                vehicleId,
                List.of()
        );
    }

    @Override
    public Reservation save(Reservation reservation) {
        logger.info(
                "Saving reservation {} for vehicle {}",
                reservation.id(),
                reservation.vehicleId()
        );

        reservationsByVehicleId
                .computeIfAbsent(
                        reservation.vehicleId(),
                        ignored -> new ArrayList<>()
                )
                .add(reservation);

        logger.info(
                "Reservation {} saved successfully. Vehicle {} now has {} reservation(s)",
                reservation.id(),
                reservation.vehicleId(),
                reservationsByVehicleId
                        .get(reservation.vehicleId())
                        .size()
        );

        return reservation;
    }

    @Override
    public void deleteAll() {
        logger.info(
                "Deleting all reservations. Current reservation count: {}",
                findAll().size()
        );

        reservationsByVehicleId.clear();

        logger.info(
                "All reservations deleted successfully"
        );
    }
}