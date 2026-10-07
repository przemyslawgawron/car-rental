import {
    render,
    screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import ReservationPage from "./ReservationPage";

import type { Reservation } from "../models/Reservation";

describe("ReservationPage", () => {
    const reservation: Reservation = {
        id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        vehicleId:
            "11111111-1111-1111-1111-111111111111",
        carType: "SEDAN",
        startDateTime: "2099-10-10T10:00:00",
        endDate: "2099-10-13",
        numberOfDays: 3,
    };

    it("renders reservation confirmation", () => {
        render(
            <ReservationPage
                reservation={reservation}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByRole("heading", {
                name: "Reservation Confirmed",
            })
        ).toBeInTheDocument();
    });

    it("renders all reservation details", () => {
        render(
            <ReservationPage
                reservation={reservation}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByText("SEDAN")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "11111111-1111-1111-1111-111111111111"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText("3 days")
        ).toBeInTheDocument();

        expect(
            screen.getByText("10 Oct 2099, 10:00")
        ).toBeInTheDocument();

        expect(
            screen.getByText("13 Oct 2099")
        ).toBeInTheDocument();
    });

    it("renders singular day correctly", () => {
        const oneDayReservation: Reservation = {
            ...reservation,
            numberOfDays: 1,
        };

        render(
            <ReservationPage
                reservation={oneDayReservation}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByText("1 day")
        ).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
        const user = userEvent.setup();

        const onClose = vi.fn();

        render(
            <ReservationPage
                reservation={reservation}
                onClose={onClose}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: /close/i,
            })
        );

        expect(
            onClose
        ).toHaveBeenCalledTimes(1);
    });
});