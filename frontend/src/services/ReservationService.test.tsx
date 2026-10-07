import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { ReservationService } from "./ReservationService";

import type { CreateReservationRequest } from "../models/CreateReservationRequest";
import type { Reservation } from "../models/Reservation";

describe("ReservationService", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.stubGlobal(
            "fetch",
            fetchMock
        );

        vi.spyOn(
            console,
            "log"
        ).mockImplementation(() => {});

        vi.spyOn(
            console,
            "error"
        ).mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    describe("createReservation", () => {
        const request: CreateReservationRequest = {
            vehicleId:
                "11111111-1111-1111-1111-111111111111",
            startDateTime:
                "2099-10-10T10:00",
            endDate:
                "2099-10-13",
        };

        const reservation: Reservation = {
            id:
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            vehicleId:
                "11111111-1111-1111-1111-111111111111",
            carType: "SEDAN",
            startDateTime:
                "2099-10-10T10:00",
            endDate:
                "2099-10-13",
            numberOfDays: 3,
        };

        it("creates reservation with expected request", async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                statusText: "OK",
                json: vi.fn().mockResolvedValue(
                    reservation
                ),
            });

            const service =
                new ReservationService();

            const result =
                await service.createReservation(
                    request
                );

            expect(
                fetchMock
            ).toHaveBeenCalledWith(
                "/api/reservations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        request
                    ),
                    signal: undefined,
                }
            );

            expect(
                result
            ).toEqual(reservation);
        });

        it("passes abort signal when creating reservation", async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                statusText: "OK",
                json: vi.fn().mockResolvedValue(
                    reservation
                ),
            });

            const controller =
                new AbortController();

            const service =
                new ReservationService();

            await service.createReservation(
                request,
                controller.signal
            );

            expect(
                fetchMock
            ).toHaveBeenCalledWith(
                "/api/reservations",
                expect.objectContaining({
                    signal:
                    controller.signal,
                })
            );
        });

        it("throws backend error message when create fails", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 409,
                statusText: "Conflict",
                json: vi.fn().mockResolvedValue({
                    message:
                        "Vehicle is no longer available.",
                }),
            });

            const service =
                new ReservationService();

            await expect(
                service.createReservation(
                    request
                )
            ).rejects.toThrow(
                "Vehicle is no longer available."
            );
        });

        it("uses fallback error message when create response has no message", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 500,
                statusText:
                    "Internal Server Error",
                json: vi.fn().mockResolvedValue(
                    {}
                ),
            });

            const service =
                new ReservationService();

            await expect(
                service.createReservation(
                    request
                )
            ).rejects.toThrow(
                "Failed to create reservation: 500 Internal Server Error"
            );
        });

        it("rethrows create request errors", async () => {
            fetchMock.mockRejectedValue(
                new Error("Network error")
            );

            const service =
                new ReservationService();

            await expect(
                service.createReservation(
                    request
                )
            ).rejects.toThrow(
                "Network error"
            );
        });
    });

    describe("getReservations", () => {
        const reservations: Reservation[] = [
            {
                id:
                    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
                vehicleId:
                    "11111111-1111-1111-1111-111111111111",
                carType: "SEDAN",
                startDateTime:
                    "2099-10-10T10:00",
                endDate:
                    "2099-10-13",
                numberOfDays: 3,
            },
        ];

        it("fetches reservations", async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                statusText: "OK",
                json: vi.fn().mockResolvedValue({
                    reservations,
                }),
            });

            const service =
                new ReservationService();

            const result =
                await service.getReservations();

            expect(
                fetchMock
            ).toHaveBeenCalledWith(
                "/api/reservations",
                {
                    signal: undefined,
                }
            );

            expect(
                result
            ).toEqual({
                reservations,
            });
        });

        it("passes abort signal when fetching reservations", async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                status: 200,
                statusText: "OK",
                json: vi.fn().mockResolvedValue({
                    reservations: [],
                }),
            });

            const controller =
                new AbortController();

            const service =
                new ReservationService();

            await service.getReservations(
                controller.signal
            );

            expect(
                fetchMock
            ).toHaveBeenCalledWith(
                "/api/reservations",
                {
                    signal:
                    controller.signal,
                }
            );
        });

        it("throws backend error message when fetching reservations fails", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 500,
                statusText:
                    "Internal Server Error",
                json: vi.fn().mockResolvedValue({
                    message:
                        "Unable to load reservations.",
                }),
            });

            const service =
                new ReservationService();

            await expect(
                service.getReservations()
            ).rejects.toThrow(
                "Unable to load reservations."
            );
        });

        it("uses fallback error message when fetch response has no message", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 500,
                statusText:
                    "Internal Server Error",
                json: vi.fn().mockResolvedValue(
                    {}
                ),
            });

            const service =
                new ReservationService();

            await expect(
                service.getReservations()
            ).rejects.toThrow(
                "Failed to fetch reservations: 500 Internal Server Error"
            );
        });

        it("rethrows reservation fetch errors", async () => {
            fetchMock.mockRejectedValue(
                new Error("Network error")
            );

            const service =
                new ReservationService();

            await expect(
                service.getReservations()
            ).rejects.toThrow(
                "Network error"
            );
        });
    });

    describe("deleteReservations", () => {
        it("deletes all reservations", async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                status: 204,
                statusText:
                    "No Content",
            });

            const service =
                new ReservationService();

            await service.deleteReservations();

            expect(
                fetchMock
            ).toHaveBeenCalledWith(
                "/api/reservations",
                {
                    method: "DELETE",
                }
            );
        });

        it("throws when delete response is not successful", async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 500,
                statusText:
                    "Internal Server Error",
            });

            const service =
                new ReservationService();

            await expect(
                service.deleteReservations()
            ).rejects.toThrow(
                "Failed to delete reservations: 500 Internal Server Error"
            );
        });

        it("rethrows delete request errors", async () => {
            fetchMock.mockRejectedValue(
                new Error("Network error")
            );

            const service =
                new ReservationService();

            await expect(
                service.deleteReservations()
            ).rejects.toThrow(
                "Network error"
            );
        });
    });
});