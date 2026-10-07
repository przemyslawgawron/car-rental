package com.example.carrental.repository;

import com.example.carrental.model.Reservation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class InMemoryReservationRepositoryTest {

    private InMemoryReservationRepository reservationRepository;

    private UUID vehicle1Id;
    private UUID vehicle2Id;

    private Reservation reservation1;
    private Reservation reservation2;
    private Reservation reservation3;

    @BeforeEach
    void setUp() {
        reservationRepository =
                new InMemoryReservationRepository();

        vehicle1Id =
                UUID.fromString(
                        "11111111-1111-1111-1111-111111111111"
                );

        vehicle2Id =
                UUID.fromString(
                        "22222222-2222-2222-2222-222222222222"
                );

        reservation1 =
                new Reservation(
                        UUID.randomUUID(),
                        vehicle1Id,
                        LocalDateTime.of(
                                2030,
                                10,
                                10,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                13
                        )
                );

        reservation2 =
                new Reservation(
                        UUID.randomUUID(),
                        vehicle1Id,
                        LocalDateTime.of(
                                2030,
                                10,
                                20,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                23
                        )
                );

        reservation3 =
                new Reservation(
                        UUID.randomUUID(),
                        vehicle2Id,
                        LocalDateTime.of(
                                2030,
                                11,
                                1,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                11,
                                5
                        )
                );
    }

    @Test
    void savesReservation() {
        Reservation savedReservation =
                reservationRepository.save(
                        reservation1
                );

        assertEquals(
                reservation1,
                savedReservation
        );

        assertEquals(
                List.of(reservation1),
                reservationRepository.findByVehicleId(
                        vehicle1Id
                )
        );
    }

    @Test
    void findsReservationsByVehicleId() {
        reservationRepository.save(
                reservation1
        );

        reservationRepository.save(
                reservation2
        );

        reservationRepository.save(
                reservation3
        );

        List<Reservation> result =
                reservationRepository.findByVehicleId(
                        vehicle1Id
                );

        assertEquals(
                2,
                result.size()
        );

        assertTrue(
                result.contains(reservation1)
        );

        assertTrue(
                result.contains(reservation2)
        );

        assertFalse(
                result.contains(reservation3)
        );
    }

    @Test
    void returnsEmptyListWhenVehicleHasNoReservations() {
        List<Reservation> result =
                reservationRepository.findByVehicleId(
                        vehicle1Id
                );

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void findsAllReservations() {
        reservationRepository.save(
                reservation1
        );

        reservationRepository.save(
                reservation2
        );

        reservationRepository.save(
                reservation3
        );

        List<Reservation> result =
                reservationRepository.findAll();

        assertEquals(
                3,
                result.size()
        );

        assertTrue(
                result.contains(reservation1)
        );

        assertTrue(
                result.contains(reservation2)
        );

        assertTrue(
                result.contains(reservation3)
        );
    }

    @Test
    void deletesAllReservations() {
        reservationRepository.save(
                reservation1
        );

        reservationRepository.save(
                reservation2
        );

        reservationRepository.save(
                reservation3
        );

        reservationRepository.deleteAll();

        assertTrue(
                reservationRepository
                        .findAll()
                        .isEmpty()
        );

        assertTrue(
                reservationRepository
                        .findByVehicleId(vehicle1Id)
                        .isEmpty()
        );

        assertTrue(
                reservationRepository
                        .findByVehicleId(vehicle2Id)
                        .isEmpty()
        );
    }
}