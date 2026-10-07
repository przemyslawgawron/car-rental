package com.example.carrental.controller;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Vehicle;
import com.example.carrental.service.AvailabilityService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AvailabilityController.class)
class AvailabilityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AvailabilityService availabilityService;

    @Test
    void returnsAvailabilityResponse() throws Exception {
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

        Vehicle vehicle =
                new Vehicle(
                        UUID.fromString(
                                "11111111-1111-1111-1111-111111111111"
                        ),
                        CarType.SEDAN
                );

        when(
                availabilityService.getAvailableVehicles(
                        CarType.SEDAN,
                        startDateTime,
                        endDate
                )
        ).thenReturn(
                List.of(vehicle)
        );

        mockMvc.perform(
                        get("/api/availability")
                                .param(
                                        "carType",
                                        "SEDAN"
                                )
                                .param(
                                        "startDateTime",
                                        "2030-10-10T10:00"
                                )
                                .param(
                                        "endDate",
                                        "2030-10-13"
                                )
                )
                .andExpect(
                        status().isOk()
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
                )
                .andExpect(
                        jsonPath("$.availableVehicles.length()")
                                .value(1)
                )
                .andExpect(
                        jsonPath("$.availableVehicles[0].id")
                                .value(
                                        "11111111-1111-1111-1111-111111111111"
                                )
                )
                .andExpect(
                        jsonPath("$.availableVehicles[0].carType")
                                .value("SEDAN")
                );

        verify(
                availabilityService
        ).getAvailableVehicles(
                CarType.SEDAN,
                startDateTime,
                endDate
        );
    }

    @Test
    void returnsEmptyAvailableVehicles() throws Exception {
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

        when(
                availabilityService.getAvailableVehicles(
                        CarType.SUV,
                        startDateTime,
                        endDate
                )
        ).thenReturn(
                List.of()
        );

        mockMvc.perform(
                        get("/api/availability")
                                .param(
                                        "carType",
                                        "SUV"
                                )
                                .param(
                                        "startDateTime",
                                        "2030-10-10T10:00"
                                )
                                .param(
                                        "endDate",
                                        "2030-10-13"
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.numberOfDays")
                                .value(3)
                )
                .andExpect(
                        jsonPath("$.availableVehicles.length()")
                                .value(0)
                );
    }

    @Test
    void returnsBadRequestForInvalidCarType() throws Exception {
        mockMvc.perform(
                        get("/api/availability")
                                .param(
                                        "carType",
                                        "TRUCK"
                                )
                                .param(
                                        "startDateTime",
                                        "2030-10-10T10:00"
                                )
                                .param(
                                        "endDate",
                                        "2030-10-13"
                                )
                )
                .andExpect(
                        status().isBadRequest()
                );
    }
}