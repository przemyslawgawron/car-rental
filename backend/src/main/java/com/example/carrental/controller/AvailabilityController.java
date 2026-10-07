package com.example.carrental.controller;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Vehicle;
import com.example.carrental.service.AvailabilityService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(
            AvailabilityService availabilityService
    ) {
        this.availabilityService = availabilityService;
    }

    @GetMapping
    public AvailabilitySearchResponse getAvailability(
            @RequestParam
            CarType carType,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDateTime,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        List<Vehicle> availableVehicles =
                availabilityService.getAvailableVehicles(
                        carType,
                        startDateTime,
                        endDate
                );

        // Count the number of days between startDateTime and endDate
        long numberOfDays =
                ChronoUnit.DAYS.between(
                        startDateTime.toLocalDate(),
                        endDate
                );

        return new AvailabilitySearchResponse(
                startDateTime,
                endDate,
                numberOfDays,
                availableVehicles
        );
    }

    public record AvailabilitySearchResponse(
            LocalDateTime startDateTime,
            LocalDate endDate,
            long numberOfDays,
            List<Vehicle> availableVehicles
    ) {
    }
}