import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { AvailabilityService } from "./AvailabilityService";

describe("AvailabilityService", () => {
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

    it("fetches availability with expected query parameters", async () => {
        const responseBody = {
            startDateTime: "2099-10-10T10:00",
            endDate: "2099-10-13",
            numberOfDays: 3,
            availableVehicles: [
                {
                    id: "11111111-1111-1111-1111-111111111111",
                    carType: "SEDAN",
                },
            ],
        };

        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: vi.fn().mockResolvedValue(
                responseBody
            ),
        });

        const service =
            new AvailabilityService();

        const result =
            await service.getAvailability(
                "SEDAN",
                "2099-10-10T10:00",
                "2099-10-13"
            );

        expect(
            fetchMock
        ).toHaveBeenCalledWith(
            "/api/availability?carType=SEDAN&startDateTime=2099-10-10T10%3A00&endDate=2099-10-13",
            {
                signal: undefined,
            }
        );

        expect(
            result
        ).toEqual(responseBody);
    });

    it("passes abort signal to fetch", async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: vi.fn().mockResolvedValue({
                startDateTime:
                    "2099-10-10T10:00",
                endDate:
                    "2099-10-13",
                numberOfDays: 3,
                availableVehicles: [],
            }),
        });

        const controller =
            new AbortController();

        const service =
            new AvailabilityService();

        await service.getAvailability(
            "SUV",
            "2099-10-10T10:00",
            "2099-10-13",
            controller.signal
        );

        expect(
            fetchMock
        ).toHaveBeenCalledWith(
            expect.stringContaining(
                "/api/availability?"
            ),
            {
                signal: controller.signal,
            }
        );
    });

    it("returns parsed response body", async () => {
        const responseBody = {
            startDateTime: "2099-10-10T10:00",
            endDate: "2099-10-13",
            numberOfDays: 3,
            availableVehicles: [],
        };

        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: vi.fn().mockResolvedValue(
                responseBody
            ),
        });

        const service =
            new AvailabilityService();

        const result =
            await service.getAvailability(
                "VAN",
                "2099-10-10T10:00",
                "2099-10-13"
            );

        expect(
            result
        ).toEqual(responseBody);
    });

    it("throws backend error message when response is not successful", async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 400,
            statusText: "Bad Request",
            json: vi.fn().mockResolvedValue({
                message:
                    "End date must be after start date.",
            }),
        });

        const service =
            new AvailabilityService();

        await expect(
            service.getAvailability(
                "SEDAN",
                "2099-10-10T10:00",
                "2099-10-10"
            )
        ).rejects.toThrow(
            "End date must be after start date."
        );
    });

    it("uses fallback error message when backend provides no message", async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 500,
            statusText:
                "Internal Server Error",
            json: vi.fn().mockResolvedValue({}),
        });

        const service =
            new AvailabilityService();

        await expect(
            service.getAvailability(
                "SEDAN",
                "2099-10-10T10:00",
                "2099-10-13"
            )
        ).rejects.toThrow(
            "Failed to fetch availability: 500 Internal Server Error"
        );
    });

    it("rethrows fetch errors", async () => {
        const networkError =
            new Error("Network error");

        fetchMock.mockRejectedValue(
            networkError
        );

        const service =
            new AvailabilityService();

        await expect(
            service.getAvailability(
                "SEDAN",
                "2099-10-10T10:00",
                "2099-10-13"
            )
        ).rejects.toThrow(
            "Network error"
        );
    });
});