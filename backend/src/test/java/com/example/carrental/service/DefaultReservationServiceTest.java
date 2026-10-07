package com.example.carrental.service;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Reservation;
import com.example.carrental.model.Vehicle;
import com.example.carrental.repository.ReservationRepository;
import com.example.carrental.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DefaultReservationServiceTest {

    private AvailabilityService availabilityService;
    private VehicleRepository vehicleRepository;
    private ReservationRepository reservationRepository;

    private DefaultReservationService reservationService;

    private UUID vehicleId;
    private Vehicle vehicle;

    private LocalDateTime startDateTime;
    private LocalDate endDate;

    @BeforeEach
    void setUp() {
        availabilityService =
                mock(AvailabilityService.class);

        vehicleRepository =
                mock(VehicleRepository.class);

        reservationRepository =
                mock(ReservationRepository.class);

        reservationService =
                new DefaultReservationService(
                        availabilityService,
                        vehicleRepository,
                        reservationRepository
                );

        vehicleId =
                UUID.fromString(
                        "11111111-1111-1111-1111-111111111111"
                );

        vehicle =
                new Vehicle(
                        vehicleId,
                        CarType.SEDAN
                );

        startDateTime =
                LocalDateTime.of(
                        2026,
                        10,
                        10,
                        10,
                        0
                );

        endDate =
                LocalDate.of(
                        2026,
                        10,
                        13
                );
    }

    @Test
    void reservesAvailableVehicle() {
        when(vehicleRepository.findById(vehicleId))
                .thenReturn(Optional.of(vehicle));

        when(availabilityService.getAvailableVehicles(
                CarType.SEDAN,
                startDateTime,
                endDate
        )).thenReturn(List.of(vehicle));

        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        Reservation result =
                reservationService.reserve(
                        vehicleId,
                        startDateTime,
                        endDate
                );

        assertNotNull(result);
        assertNotNull(result.id());
        assertEquals(
                vehicleId,
                result.vehicleId()
        );
        assertEquals(
                startDateTime,
                result.startDateTime()
        );
        assertEquals(
                endDate,
                result.endDate()
        );

        verify(reservationRepository)
                .save(any(Reservation.class));
    }

    @Test
    void rejectsUnknownVehicle() {
        when(vehicleRepository.findById(vehicleId))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () ->
                                reservationService.reserve(
                                        vehicleId,
                                        startDateTime,
                                        endDate
                                )
                );

        assertEquals(
                "Vehicle not found.",
                exception.getMessage()
        );

        verifyNoInteractions(
                availabilityService
        );

        verify(
                reservationRepository,
                never()
        ).save(any());
    }

    @Test
    void rejectsUnavailableVehicle() {
        when(vehicleRepository.findById(vehicleId))
                .thenReturn(Optional.of(vehicle));

        when(availabilityService.getAvailableVehicles(
                CarType.SEDAN,
                startDateTime,
                endDate
        )).thenReturn(List.of());

        IllegalStateException exception =
                assertThrows(
                        IllegalStateException.class,
                        () ->
                                reservationService.reserve(
                                        vehicleId,
                                        startDateTime,
                                        endDate
                                )
                );

        assertEquals(
                "Vehicle is no longer available.",
                exception.getMessage()
        );

        verify(
                reservationRepository,
                never()
        ).save(any());
    }

    @Test
    void onlyAcceptsRequestedVehicleAsAvailable() {
        Vehicle anotherVehicle =
                new Vehicle(
                        UUID.fromString(
                                "22222222-2222-2222-2222-222222222222"
                        ),
                        CarType.SEDAN
                );

        when(vehicleRepository.findById(vehicleId))
                .thenReturn(Optional.of(vehicle));

        when(availabilityService.getAvailableVehicles(
                CarType.SEDAN,
                startDateTime,
                endDate
        )).thenReturn(
                List.of(anotherVehicle)
        );

        assertThrows(
                IllegalStateException.class,
                () ->
                        reservationService.reserve(
                                vehicleId,
                                startDateTime,
                                endDate
                        )
        );

        verify(
                reservationRepository,
                never()
        ).save(any());
    }

    @Test
    void savesReservationWithExpectedValues() {
        when(vehicleRepository.findById(vehicleId))
                .thenReturn(Optional.of(vehicle));

        when(availabilityService.getAvailableVehicles(
                CarType.SEDAN,
                startDateTime,
                endDate
        )).thenReturn(List.of(vehicle));

        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        reservationService.reserve(
                vehicleId,
                startDateTime,
                endDate
        );

        ArgumentCaptor<Reservation> captor =
                ArgumentCaptor.forClass(
                        Reservation.class
                );

        verify(reservationRepository)
                .save(captor.capture());

        Reservation savedReservation =
                captor.getValue();

        assertNotNull(
                savedReservation.id()
        );

        assertEquals(
                vehicleId,
                savedReservation.vehicleId()
        );

        assertEquals(
                startDateTime,
                savedReservation.startDateTime()
        );

        assertEquals(
                endDate,
                savedReservation.endDate()
        );
    }

    @Test
    void getsReservations() {
        Reservation reservation =
                new Reservation(
                        UUID.randomUUID(),
                        vehicleId,
                        startDateTime,
                        endDate
                );

        when(reservationRepository.findAll())
                .thenReturn(
                        List.of(reservation)
                );

        List<Reservation> result =
                reservationService.getReservations();

        assertEquals(
                List.of(reservation),
                result
        );

        verify(reservationRepository)
                .findAll();
    }

    @Test
    void deletesReservations() {
        reservationService.deleteReservations();

        verify(reservationRepository)
                .deleteAll();
    }
}