package com.example.carrental.controller;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Reservation;
import com.example.carrental.model.Vehicle;
import com.example.carrental.repository.VehicleRepository;
import com.example.carrental.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservationController.class)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReservationService reservationService;

    @MockitoBean
    private VehicleRepository vehicleRepository;

    @Test
    void createsReservation() throws Exception {
        UUID vehicleId =
                UUID.fromString(
                        "11111111-1111-1111-1111-111111111111"
                );

        UUID reservationId =
                UUID.fromString(
                        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
                );

        LocalDateTime startDateTime =
                LocalDateTime.of(
                        2030,
                        10,
                        10,
                        10,
                        0
                );

        LocalDate endDate =
                LocalDate.of(
                        2030,
                        10,
                        13
                );

        Reservation reservation =
                new Reservation(
                        reservationId,
                        vehicleId,
                        startDateTime,
                        endDate
                );

        Vehicle vehicle =
                new Vehicle(
                        vehicleId,
                        CarType.SEDAN
                );

        when(
                reservationService.reserve(
                        vehicleId,
                        startDateTime,
                        endDate
                )
        ).thenReturn(
                reservation
        );

        when(
                vehicleRepository.findById(vehicleId)
        ).thenReturn(
                Optional.of(vehicle)
        );

        mockMvc.perform(
                        post("/api/reservations")
                                .contentType("application/json")
                                .content("""
                                        {
                                          "vehicleId": "11111111-1111-1111-1111-111111111111",
                                          "startDateTime": "2030-10-10T10:00:00",
                                          "endDate": "2030-10-13"
                                        }
                                        """)
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(
                                        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
                                )
                )
                .andExpect(
                        jsonPath("$.vehicleId")
                                .value(
                                        "11111111-1111-1111-1111-111111111111"
                                )
                )
                .andExpect(
                        jsonPath("$.carType")
                                .value("SEDAN")
                )
                .andExpect(
                        jsonPath("$.startDateTime")
                                .value(
                                        "2030-10-10T10:00:00"
                                )
                )
                .andExpect(
                        jsonPath("$.endDate")
                                .value(
                                        "2030-10-13"
                                )
                )
                .andExpect(
                        jsonPath("$.numberOfDays")
                                .value(3)
                );

        verify(
                reservationService
        ).reserve(
                vehicleId,
                startDateTime,
                endDate
        );
    }

    @Test
    void getsReservations() throws Exception {
        UUID vehicleId =
                UUID.fromString(
                        "11111111-1111-1111-1111-111111111111"
                );

        Reservation reservation =
                new Reservation(
                        UUID.fromString(
                                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
                        ),
                        vehicleId,
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

        Vehicle vehicle =
                new Vehicle(
                        vehicleId,
                        CarType.SEDAN
                );

        when(
                reservationService.getReservations()
        ).thenReturn(
                List.of(reservation)
        );

        when(
                vehicleRepository.findById(vehicleId)
        ).thenReturn(
                Optional.of(vehicle)
        );

        mockMvc.perform(
                        get("/api/reservations")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.reservations.length()")
                                .value(1)
                )
                .andExpect(
                        jsonPath("$.reservations[0].id")
                                .value(
                                        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
                                )
                )
                .andExpect(
                        jsonPath("$.reservations[0].vehicleId")
                                .value(
                                        "11111111-1111-1111-1111-111111111111"
                                )
                )
                .andExpect(
                        jsonPath("$.reservations[0].carType")
                                .value("SEDAN")
                )
                .andExpect(
                        jsonPath("$.reservations[0].numberOfDays")
                                .value(3)
                );
    }

    @Test
    void getsEmptyReservations() throws Exception {
        when(
                reservationService.getReservations()
        ).thenReturn(
                List.of()
        );

        mockMvc.perform(
                        get("/api/reservations")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.reservations.length()")
                                .value(0)
                );

        verify(
                reservationService
        ).getReservations();

        verifyNoInteractions(
                vehicleRepository
        );
    }

    @Test
    void deletesReservations() throws Exception {
        mockMvc.perform(
                        delete("/api/reservations")
                )
                .andExpect(
                        status().isNoContent()
                );

        verify(
                reservationService
        ).deleteReservations();
    }
}