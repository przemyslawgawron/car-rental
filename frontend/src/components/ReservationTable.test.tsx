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

import ReservationTable from "./ReservationTable";

import type { Reservation } from "../models/Reservation";

const {
    getReservationsMock,
    deleteReservationsMock,
} = vi.hoisted(() => ({
    getReservationsMock: vi.fn(),
    deleteReservationsMock: vi.fn(),
}));

vi.mock("../services/ReservationService", () => ({
    ReservationService: class {
        getReservations = getReservationsMock;
        deleteReservations = deleteReservationsMock;
    },
}));

describe("ReservationTable", () => {
    const reservations: Reservation[] = [
        {
            id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            vehicleId:
                "11111111-1111-1111-1111-111111111111",
            carType: "SEDAN",
            startDateTime: "2099-10-10T10:00:00",
            endDate: "2099-10-13",
            numberOfDays: 3,
        },
        {
            id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
            vehicleId:
                "44444444-4444-4444-4444-444444444444",
            carType: "SUV",
            startDateTime: "2099-11-01T14:00:00",
            endDate: "2099-11-05",
            numberOfDays: 4,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading while reservations are being loaded", () => {
        getReservationsMock.mockReturnValue(
            new Promise(() => {
                // Intentionally unresolved.
            })
        );

        render(
            <ReservationTable />
        );

        expect(
            screen.getByRole("progressbar")
        ).toBeInTheDocument();
    });

    it("renders reservations returned by the service", async () => {
        getReservationsMock.mockResolvedValue({
            reservations,
        });

        render(
            <ReservationTable />
        );

        expect(
            await screen.findByText(
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "11111111-1111-1111-1111-111111111111"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "44444444-4444-4444-4444-444444444444"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("SEDAN")
        ).toBeInTheDocument();

        expect(
            screen.getByText("SUV")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("table")
        ).toBeInTheDocument();
    });

    it("shows empty state when there are no reservations", async () => {
        getReservationsMock.mockResolvedValue({
            reservations: [],
        });

        render(
            <ReservationTable />
        );

        expect(
            await screen.findByText(
                "No reservations yet."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /delete all/i,
            })
        ).toBeDisabled();
    });

    it("shows error when loading reservations fails", async () => {
        getReservationsMock.mockRejectedValue(
            new Error(
                "Unable to load reservations."
            )
        );

        render(
            <ReservationTable />
        );

        expect(
            await screen.findByText(
                "Unable to load reservations."
            )
        ).toBeInTheDocument();
    });

    it("deletes all reservations", async () => {
        const user = userEvent.setup();

        getReservationsMock.mockResolvedValue({
            reservations,
        });

        deleteReservationsMock.mockResolvedValue(
            undefined
        );

        render(
            <ReservationTable />
        );

        await screen.findByText(
            "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        );

        await user.click(
            screen.getByRole("button", {
                name: /delete all/i,
            })
        );

        await waitFor(() => {
            expect(
                deleteReservationsMock
            ).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText(
                "No reservations yet."
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            )
        ).not.toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /delete all/i,
            })
        ).toBeDisabled();
    });

    it("shows deleting state while delete request is pending", async () => {
        const user = userEvent.setup();

        getReservationsMock.mockResolvedValue({
            reservations,
        });

        deleteReservationsMock.mockReturnValue(
            new Promise(() => {
                // Intentionally unresolved.
            })
        );

        render(
            <ReservationTable />
        );

        await screen.findByText(
            "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        );

        await user.click(
            screen.getByRole("button", {
                name: /delete all/i,
            })
        );

        expect(
            screen.getByRole("button", {
                name: /deleting/i,
            })
        ).toBeDisabled();
    });

    it("shows error when deleting reservations fails", async () => {
        const user = userEvent.setup();

        getReservationsMock.mockResolvedValue({
            reservations,
        });

        deleteReservationsMock.mockRejectedValue(
            new Error(
                "Unable to delete reservations."
            )
        );

        render(
            <ReservationTable />
        );

        await screen.findByText(
            "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        );

        await user.click(
            screen.getByRole("button", {
                name: /delete all/i,
            })
        );

        expect(
            await screen.findByText(
                "Unable to delete reservations."
            )
        ).toBeInTheDocument();
    });

    it("reloads reservations when refreshKey changes", async () => {
        getReservationsMock.mockResolvedValue({
            reservations,
        });

        const { rerender } = render(
            <ReservationTable
                refreshKey="reservation-1"
            />
        );

        await waitFor(() => {
            expect(
                getReservationsMock
            ).toHaveBeenCalledTimes(1);
        });

        rerender(
            <ReservationTable
                refreshKey="reservation-2"
            />
        );

        await waitFor(() => {
            expect(
                getReservationsMock
            ).toHaveBeenCalledTimes(2);
        });
    });
});