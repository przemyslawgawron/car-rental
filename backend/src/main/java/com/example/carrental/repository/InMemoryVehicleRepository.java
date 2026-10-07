package com.example.carrental.repository;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Vehicle;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class InMemoryVehicleRepository implements VehicleRepository {

    private final List<Vehicle> vehicles;

    public InMemoryVehicleRepository(List<Vehicle> vehicles) {
        this.vehicles = List.copyOf(vehicles);
    }

    @Override
    public List<Vehicle> findAll() {
        return vehicles;
    }

    @Override
    public List<Vehicle> findByCarType(CarType carType) {
        return vehicles.stream()
                .filter(vehicle -> vehicle.carType() == carType)
                .toList();
    }

    @Override
    public Optional<Vehicle> findById(UUID vehicleId) {
        return vehicles.stream()
                .filter(vehicle -> vehicle.id().equals(vehicleId))
                .findFirst();
    }
}