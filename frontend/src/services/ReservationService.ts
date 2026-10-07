import type { CreateReservationRequest } from "../models/CreateReservationRequest";
import type { Reservation } from "../models/Reservation";

type ReservationsResponse = {
    reservations: Reservation[];
};

export class ReservationService {
    async createReservation(
        request: CreateReservationRequest,
        signal?: AbortSignal
    ): Promise<Reservation> {
        const url = "/api/reservations";

        console.log("Reservation request:", {
            method: "POST",
            url,
            body: request,
        });

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
                signal,
            });

            console.log("Reservation response:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
            });

            if (!response.ok) {
                const errorBody = await response.json();

                console.error("Reservation error response:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorBody,
                });

                throw new Error(
                    errorBody.message ??
                    `Failed to create reservation: ${response.status} ${response.statusText}`
                );
            }

            const data: Reservation = await response.json();

            console.log("Reservation response body:", data);

            return data;
        } catch (error) {
            console.error("Reservation request failed:", error);

            throw error;
        }
    }

    async getReservations(
        signal?: AbortSignal
    ): Promise<ReservationsResponse> {
        const url = "/api/reservations";

        console.log("Reservations request:", {
            method: "GET",
            url,
        });

        try {
            const response = await fetch(url, {
                signal,
            });

            console.log("Reservations response:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
            });

            if (!response.ok) {
                const errorBody = await response.json();

                console.error("Reservations error response:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorBody,
                });

                throw new Error(
                    errorBody.message ??
                    `Failed to fetch reservations: ${response.status} ${response.statusText}`
                );
            }

            const data: ReservationsResponse =
                await response.json();

            console.log(
                "Reservations response body:",
                data
            );

            return data;
        } catch (error) {
            console.error(
                "Reservations request failed:",
                error
            );

            throw error;
        }
    }

    async deleteReservations(): Promise<void> {
        const url = "/api/reservations";

        console.log("Delete reservations request:", {
            method: "DELETE",
            url,
        });

        try {
            const response = await fetch(url, {
                method: "DELETE",
            });

            console.log("Delete reservations response:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to delete reservations: ${response.status} ${response.statusText}`
                );
            }

            console.log(
                "Reservations deleted successfully"
            );
        } catch (error) {
            console.error(
                "Delete reservations request failed:",
                error
            );

            throw error;
        }
    }
}