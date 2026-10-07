import {
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import BookingPage from "./BookingPage";

import type { AvailabilitySearchResult } from "../models/AvailabilitySearchResult";
import type { Reservation } from "../models/Reservation";

const { createReservationMock } = vi.hoisted(() => ({
    createReservationMock: vi.fn(),
}));

vi.mock("../services/ReservationService", () => ({
    ReservationService: class {
        createReservation = createReservationMock;
    },
}));

describe("BookingPage", () => {
    const result: AvailabilitySearchResult = {
        startDateTime: "2099-10-10T10:00",
        endDate: "2099-10-13",
        numberOfDays: 3,
        availableVehicles: [
            {
                id: "11111111-1111-1111-1111-111111111111",
                carType: "SEDAN",
            },
            {
                id: "22222222-2222-2222-2222-222222222222",
                carType: "SEDAN",
            },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders available vehicles", () => {
        render(
            <BookingPage
                result={result}
                onBack={vi.fn()}
                onReservationCreated={vi.fn()}
            />
        );

        expect(
            screen.getByText(
                (_, element) =>
                    element?.textContent ===
                    "Vehicle ID: 11111111-1111-1111-1111-111111111111"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                (_, element) =>
                    element?.textContent ===
                    "Vehicle ID: 22222222-2222-2222-2222-222222222222"
            )
        ).toBeInTheDocument();

        expect(
            screen.getAllByText("SEDAN")
        ).toHaveLength(2);

        expect(
            screen.getAllByRole("button", {
                name: /reserve/i,
            })
        ).toHaveLength(2);
    });

    it("creates reservation for selected vehicle", async () => {
        const user = userEvent.setup();

        const reservation: Reservation = {
            id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            vehicleId:
                "11111111-1111-1111-1111-111111111111",
            carType: "SEDAN",
            startDateTime: "2099-10-10T10:00",
            endDate: "2099-10-13",
            numberOfDays: 3,
        };

        createReservationMock.mockResolvedValue(
            reservation
        );

        const onReservationCreated = vi.fn();

        render(
            <BookingPage
                result={result}
                onBack={vi.fn()}
                onReservationCreated={
                    onReservationCreated
                }
            />
        );

        const reserveButtons =
            screen.getAllByRole("button", {
                name: /reserve/i,
            });

        await user.click(
            reserveButtons[0]
        );

        await waitFor(() => {
            expect(
                createReservationMock
            ).toHaveBeenCalledWith({
                vehicleId:
                    "11111111-1111-1111-1111-111111111111",
                startDateTime:
                    "2099-10-10T10:00",
                endDate:
                    "2099-10-13",
            });
        });

        expect(
            onReservationCreated
        ).toHaveBeenCalledWith(
            reservation
        );
    });

    it("disables reservation buttons while reservation is pending", async () => {
        const user = userEvent.setup();

        createReservationMock.mockReturnValue(
            new Promise(() => {
                // Intentionally unresolved.
            })
        );

        render(
            <BookingPage
                result={result}
                onBack={vi.fn()}
                onReservationCreated={vi.fn()}
            />
        );

        const reserveButtons =
            screen.getAllByRole("button", {
                name: /reserve/i,
            });

        await user.click(
            reserveButtons[0]
        );

        expect(
            reserveButtons[0]
        ).toBeDisabled();

        expect(
            reserveButtons[1]
        ).toBeDisabled();

        expect(
            screen.getByRole("button", {
                name: /back/i,
            })
        ).toBeDisabled();

        expect(
            screen.getByRole("progressbar")
        ).toBeInTheDocument();
    });

    it("shows error when reservation creation fails", async () => {
        const user = userEvent.setup();

        createReservationMock.mockRejectedValue(
            new Error("Reservation failed")
        );

        render(
            <BookingPage
                result={result}
                onBack={vi.fn()}
                onReservationCreated={vi.fn()}
            />
        );

        const reserveButtons =
            screen.getAllByRole("button", {
                name: /reserve/i,
            });

        await user.click(
            reserveButtons[0]
        );

        expect(
            await screen.findByText(
                "Unable to create reservation."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Please try again."
            )
        ).toBeInTheDocument();
    });

    it("calls onBack when back button is clicked", async () => {
        const user = userEvent.setup();

        const onBack = vi.fn();

        render(
            <BookingPage
                result={result}
                onBack={onBack}
                onReservationCreated={vi.fn()}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: /back/i,
            })
        );

        expect(
            onBack
        ).toHaveBeenCalledTimes(1);
    });

    it("renders empty message when no vehicles are available", () => {
        const emptyResult: AvailabilitySearchResult = {
            ...result,
            availableVehicles: [],
        };

        render(
            <BookingPage
                result={emptyResult}
                onBack={vi.fn()}
                onReservationCreated={vi.fn()}
            />
        );

        expect(
            screen.getByText(
                "No vehicles are available for the selected dates."
            )
        ).toBeInTheDocument();
    });
});