package com.example.carrental.service;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Reservation;
import com.example.carrental.model.Vehicle;
import com.example.carrental.repository.ReservationRepository;
import com.example.carrental.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DefaultAvailabilityServiceTest {

    private VehicleRepository vehicleRepository;
    private ReservationRepository reservationRepository;

    private DefaultAvailabilityService availabilityService;

    private Vehicle sedan1;
    private Vehicle sedan2;

    @BeforeEach
    void setUp() {
        vehicleRepository =
                mock(VehicleRepository.class);

        reservationRepository =
                mock(ReservationRepository.class);

        availabilityService =
                new DefaultAvailabilityService(
                        vehicleRepository,
                        reservationRepository
                );

        sedan1 =
                new Vehicle(
                        UUID.fromString(
                                "11111111-1111-1111-1111-111111111111"
                        ),
                        CarType.SEDAN
                );

        sedan2 =
                new Vehicle(
                        UUID.fromString(
                                "22222222-2222-2222-2222-222222222222"
                        ),
                        CarType.SEDAN
                );

        when(vehicleRepository.findByCarType(CarType.SEDAN))
                .thenReturn(
                        List.of(
                                sedan1,
                                sedan2
                        )
                );
    }

    @Test
    void returnsAllVehiclesWhenThereAreNoReservations() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(List.of());

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertEquals(
                List.of(
                        sedan1,
                        sedan2
                ),
                result
        );
    }

    @Test
    void excludesVehicleWithOverlappingReservation() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        Reservation existingReservation =
                new Reservation(
                        UUID.randomUUID(),
                        sedan1.id(),
                        LocalDateTime.of(
                                2030,
                                10,
                                11,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                14
                        )
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(
                        List.of(existingReservation)
                );

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertEquals(
                List.of(sedan2),
                result
        );
    }

    @Test
    void includesVehicleWhenExistingReservationEndsBeforeRequestedStart() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        Reservation existingReservation =
                new Reservation(
                        UUID.randomUUID(),
                        sedan1.id(),
                        LocalDateTime.of(
                                2030,
                                10,
                                5,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                8
                        )
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(
                        List.of(existingReservation)
                );

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertTrue(
                result.contains(sedan1)
        );
    }

    @Test
    void includesVehicleWhenExistingReservationStartsAfterRequestedEnd() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        Reservation existingReservation =
                new Reservation(
                        UUID.randomUUID(),
                        sedan1.id(),
                        LocalDateTime.of(
                                2030,
                                10,
                                15,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                18
                        )
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(
                        List.of(existingReservation)
                );

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertTrue(
                result.contains(sedan1)
        );
    }

    @Test
    void allowsRequestedReservationToStartExactlyWhenExistingReservationEnds() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        Reservation existingReservation =
                new Reservation(
                        UUID.randomUUID(),
                        sedan1.id(),
                        LocalDateTime.of(
                                2030,
                                10,
                                7,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                10
                        )
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(
                        List.of(existingReservation)
                );

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertTrue(
                result.contains(sedan1)
        );
    }

    @Test
    void allowsRequestedReservationToEndExactlyWhenExistingReservationStarts() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        Reservation existingReservation =
                new Reservation(
                        UUID.randomUUID(),
                        sedan1.id(),
                        LocalDateTime.of(
                                2030,
                                10,
                                13,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                16
                        )
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(
                        List.of(existingReservation)
                );

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertTrue(
                result.contains(sedan1)
        );
    }

    @Test
    void excludesVehicleWhenExistingReservationContainsRequestedReservation() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        Reservation existingReservation =
                new Reservation(
                        UUID.randomUUID(),
                        sedan1.id(),
                        LocalDateTime.of(
                                2030,
                                10,
                                8,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                15
                        )
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(
                        List.of(existingReservation)
                );

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertFalse(
                result.contains(sedan1)
        );
    }

    @Test
    void excludesVehicleWhenRequestedReservationContainsExistingReservation() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        17
                );

        Reservation existingReservation =
                new Reservation(
                        UUID.randomUUID(),
                        sedan1.id(),
                        LocalDateTime.of(
                                2030,
                                10,
                                12,
                                10,
                                0
                        ),
                        LocalDate.of(
                                2030,
                                10,
                                14
                        )
                );

        when(reservationRepository.findByVehicleId(sedan1.id()))
                .thenReturn(
                        List.of(existingReservation)
                );

        when(reservationRepository.findByVehicleId(sedan2.id()))
                .thenReturn(List.of());

        List<Vehicle> result =
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        requestedStart,
                        requestedEnd
                );

        assertFalse(
                result.contains(sedan1)
        );
    }

    @Test
    void rejectsEndDateOnSameDayAsStartDate() {
        LocalDateTime requestedStart =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate requestedEnd =
                LocalDate.of(
                        2030,
                        10,
                        10
                );

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                availabilityService.getAvailableVehicles(
                                        CarType.SEDAN,
                                        requestedStart,
                                        requestedEnd
                                )
                );

        assertEquals(
                "End date must be after start date.",
                exception.getMessage()
        );

        verifyNoInteractions(
                reservationRepository
        );
    }

    @Test
    void rejectsStartDateTimeInThePast() {
        LocalDateTime requestedStart =
                LocalDateTime.now()
                        .minusDays(1);

        LocalDate requestedEnd =
                LocalDate.now()
                        .plusDays(1);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                availabilityService.getAvailableVehicles(
                                        CarType.SEDAN,
                                        requestedStart,
                                        requestedEnd
                                )
                );

        assertEquals(
                "Start date/time cannot be in the past.",
                exception.getMessage()
        );

        verifyNoInteractions(
                reservationRepository
        );
    }
}