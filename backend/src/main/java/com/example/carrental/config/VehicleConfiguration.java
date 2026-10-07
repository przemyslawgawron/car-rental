package com.example.carrental.config;

import com.example.carrental.model.CarType;
import com.example.carrental.model.Vehicle;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.UUID;

@Configuration
public class VehicleConfiguration {

    @Bean
    public List<Vehicle> vehicles() {
        return List.of(
                new Vehicle(
                        UUID.fromString("11111111-1111-1111-1111-111111111111"),
                        CarType.SEDAN
                ),
                new Vehicle(
                        UUID.fromString("22222222-2222-2222-2222-222222222222"),
                        CarType.SEDAN
                ),
                new Vehicle(
                        UUID.fromString("33333333-3333-3333-3333-333333333333"),
                        CarType.SEDAN
                ),

                new Vehicle(
                        UUID.fromString("44444444-4444-4444-4444-444444444444"),
                        CarType.SUV
                ),
                new Vehicle(
                        UUID.fromString("55555555-5555-5555-5555-555555555555"),
                        CarType.SUV
                ),

                new Vehicle(
                        UUID.fromString("66666666-6666-6666-6666-666666666666"),
                        CarType.VAN
                )
        );
    }
}