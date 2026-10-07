package com.example.carrental.repository;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Vehicle;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class InMemoryVehicleRepositoryTest {

    private Vehicle sedan1;
    private Vehicle sedan2;
    private Vehicle sedan3;
    private Vehicle suv1;
    private Vehicle suv2;
    private Vehicle van1;

    private InMemoryVehicleRepository vehicleRepository;

    @BeforeEach
    void setUp() {
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

        sedan3 =
                new Vehicle(
                        UUID.fromString(
                                "33333333-3333-3333-3333-333333333333"
                        ),
                        CarType.SEDAN
                );

        suv1 =
                new Vehicle(
                        UUID.fromString(
                                "44444444-4444-4444-4444-444444444444"
                        ),
                        CarType.SUV
                );

        suv2 =
                new Vehicle(
                        UUID.fromString(
                                "55555555-5555-5555-5555-555555555555"
                        ),
                        CarType.SUV
                );

        van1 =
                new Vehicle(
                        UUID.fromString(
                                "66666666-6666-6666-6666-666666666666"
                        ),
                        CarType.VAN
                );

        vehicleRepository =
                new InMemoryVehicleRepository(
                        List.of(
                                sedan1,
                                sedan2,
                                sedan3,
                                suv1,
                                suv2,
                                van1
                        )
                );
    }

    @Test
    void findsAllVehicles() {
        List<Vehicle> result =
                vehicleRepository.findAll();

        assertEquals(
                6,
                result.size()
        );

        assertTrue(result.contains(sedan1));
        assertTrue(result.contains(sedan2));
        assertTrue(result.contains(sedan3));
        assertTrue(result.contains(suv1));
        assertTrue(result.contains(suv2));
        assertTrue(result.contains(van1));
    }

    @Test
    void findsVehiclesByCarType() {
        List<Vehicle> sedans =
                vehicleRepository.findByCarType(
                        CarType.SEDAN
                );

        List<Vehicle> suvs =
                vehicleRepository.findByCarType(
                        CarType.SUV
                );

        List<Vehicle> vans =
                vehicleRepository.findByCarType(
                        CarType.VAN
                );

        assertEquals(
                List.of(
                        sedan1,
                        sedan2,
                        sedan3
                ),
                sedans
        );

        assertEquals(
                List.of(
                        suv1,
                        suv2
                ),
                suvs
        );

        assertEquals(
                List.of(van1),
                vans
        );
    }

    @Test
    void findsVehicleById() {
        Optional<Vehicle> result =
                vehicleRepository.findById(
                        suv1.id()
                );

        assertTrue(
                result.isPresent()
        );

        assertEquals(
                suv1,
                result.get()
        );
    }

    @Test
    void returnsEmptyWhenVehicleIdDoesNotExist() {
        Optional<Vehicle> result =
                vehicleRepository.findById(
                        UUID.randomUUID()
                );

        assertTrue(
                result.isEmpty()
        );
    }

    @Test
    void copiesVehicleListOnConstruction() {
        List<Vehicle> vehicles =
                new ArrayList<>(
                        List.of(
                                sedan1,
                                suv1
                        )
                );

        InMemoryVehicleRepository repository =
                new InMemoryVehicleRepository(
                        vehicles
                );

        vehicles.clear();

        assertEquals(
                2,
                repository.findAll().size()
        );
    }

    @Test
    void returnedVehicleListIsImmutable() {
        List<Vehicle> result =
                vehicleRepository.findAll();

        assertThrows(
                UnsupportedOperationException.class,
                () -> result.add(
                        new Vehicle(
                                UUID.randomUUID(),
                                CarType.VAN
                        )
                )
        );
    }
}