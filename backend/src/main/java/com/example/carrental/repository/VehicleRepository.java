package com.example.carrental.repository;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Vehicle;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository {

    List<Vehicle> findAll();

    List<Vehicle> findByCarType(CarType carType);

    Optional<Vehicle> findById(UUID vehicleId);
}