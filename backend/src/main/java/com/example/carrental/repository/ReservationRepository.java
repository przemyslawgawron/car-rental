package com.example.carrental.repository;

import com.example.carrental.model.Reservation;

import java.util.List;
import java.util.UUID;

public interface ReservationRepository {

    List<Reservation> findAll();

    List<Reservation> findByVehicleId(UUID vehicleId);

    Reservation save(Reservation reservation);

    void deleteAll();
}