import type { AvailabilitySearchResult } from "../models/AvailabilitySearchResult";
import type { CarType } from "../models/CarType";

export class AvailabilityService {
    async getAvailability(
        carType: CarType,
        startDateTime: string,
        endDate: string,
        signal?: AbortSignal
    ): Promise<AvailabilitySearchResult> {
        const params = new URLSearchParams({
            carType,
            startDateTime,
            endDate,
        });

        const url = `/api/availability?${params.toString()}`;

        console.log("Availability request:", {
            method: "GET",
            url,
        });

        try {
            const response = await fetch(url, {
                signal,
            });

            console.log("Availability response:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
            });

            if (!response.ok) {
                const errorBody = await response.json();

                console.error("Availability error response:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorBody,
                });

                throw new Error(
                    errorBody.message ??
                    `Failed to fetch availability: ${response.status} ${response.statusText}`
                );
            }

            const data: AvailabilitySearchResult =
                await response.json();

            console.log(
                "Availability response body:",
                data
            );

            return data;
        } catch (error) {
            console.error(
                "Availability request failed:",
                error
            );

            throw error;
        }
    }
}