package com.example.carrental.service;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Vehicle;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface AvailabilityService {

    List<Vehicle> getAvailableVehicles(
            CarType carType,
            LocalDateTime requestedStartDateTime,
            LocalDate requestedEndDate
    );
}