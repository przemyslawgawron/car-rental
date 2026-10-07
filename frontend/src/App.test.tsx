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

import App from "./App";

import type { AvailabilitySearchResult } from "./models/AvailabilitySearchResult";
import type { Reservation } from "./models/Reservation";

const availabilityResult: AvailabilitySearchResult = {
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

const reservation: Reservation = {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    vehicleId:
        "11111111-1111-1111-1111-111111111111",
    carType: "SEDAN",
    startDateTime: "2099-10-10T10:00",
    endDate: "2099-10-13",
    numberOfDays: 3,
};

vi.mock("./components/Header", () => ({
    default: () => (
        <div>
            Header
        </div>
    ),
}));

vi.mock("./components/AvailabilityPage", () => ({
    default: ({
                  onAvailabilityFound,
              }: {
        onAvailabilityFound: (
            result: AvailabilitySearchResult
        ) => void;
    }) => (
        <div>
            <div>
                Availability Page
            </div>

            <button
                onClick={() =>
                    onAvailabilityFound(
                        availabilityResult
                    )
                }
            >
                Find availability
            </button>
        </div>
    ),
}));

vi.mock("./components/BookingPage", () => ({
    default: ({
                  onBack,
                  onReservationCreated,
              }: {
        result: AvailabilitySearchResult;
        onBack: () => void;
        onReservationCreated: (
            reservation: Reservation
        ) => void;
    }) => (
        <div>
            <div>
                Booking Page
            </div>

            <button
                onClick={onBack}
            >
                Back
            </button>

            <button
                onClick={() =>
                    onReservationCreated(
                        reservation
                    )
                }
            >
                Create reservation
            </button>
        </div>
    ),
}));

vi.mock("./components/ReservationPage", () => ({
    default: ({
                  onClose,
              }: {
        reservation: Reservation;
        onClose: () => void;
    }) => (
        <div>
            <div>
                Reservation Page
            </div>

            <button
                onClick={onClose}
            >
                Close reservation
            </button>
        </div>
    ),
}));

vi.mock("./components/ReservationTable", () => ({
    default: ({
                  refreshKey,
              }: {
        refreshKey?: string;
    }) => (
        <div>
            Reservation Table
            <span data-testid="refresh-key">
                {refreshKey ?? ""}
            </span>
        </div>
    ),
}));

describe("App", () => {
    it("renders availability view initially", () => {
        render(
            <App />
        );

        expect(
            screen.getByText(
                "Availability Page"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "Booking Page"
            )
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(
                "Reservation Page"
            )
        ).not.toBeInTheDocument();
    });

    it("moves from availability to booking view", async () => {
        const user = userEvent.setup();

        render(
            <App />
        );

        await user.click(
            screen.getByRole("button", {
                name: /find availability/i,
            })
        );

        expect(
            screen.getByText(
                "Booking Page"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "Availability Page"
            )
        ).not.toBeInTheDocument();
    });

    it("moves back from booking to availability view", async () => {
        const user = userEvent.setup();

        render(
            <App />
        );

        await user.click(
            screen.getByRole("button", {
                name: /find availability/i,
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Back",
            })
        );

        expect(
            screen.getByText(
                "Availability Page"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "Booking Page"
            )
        ).not.toBeInTheDocument();
    });

    it("moves from booking to reservation view", async () => {
        const user = userEvent.setup();

        render(
            <App />
        );

        await user.click(
            screen.getByRole("button", {
                name: /find availability/i,
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: /create reservation/i,
            })
        );

        expect(
            screen.getByText(
                "Reservation Page"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "Booking Page"
            )
        ).not.toBeInTheDocument();
    });

    it("returns to availability view when reservation is closed", async () => {
        const user = userEvent.setup();

        render(
            <App />
        );

        await user.click(
            screen.getByRole("button", {
                name: /find availability/i,
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: /create reservation/i,
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: /close reservation/i,
            })
        );

        expect(
            screen.getByText(
                "Availability Page"
            )
        ).toBeInTheDocument();

        expect(
            screen.queryByText(
                "Reservation Page"
            )
        ).not.toBeInTheDocument();
    });

    it("passes reservation id to ReservationTable as refreshKey", async () => {
        const user = userEvent.setup();

        render(
            <App />
        );

        expect(
            screen.getByTestId(
                "refresh-key"
            )
        ).toHaveTextContent("");

        await user.click(
            screen.getByRole("button", {
                name: /find availability/i,
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: /create reservation/i,
            })
        );

        expect(
            screen.getByTestId(
                "refresh-key"
            )
        ).toHaveTextContent(
            "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        );
    });

    it("always renders the header and reservation table", async () => {
        const user = userEvent.setup();

        render(
            <App />
        );

        expect(
            screen.getByText("Header")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Reservation Table"
            )
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: /find availability/i,
            })
        );

        expect(
            screen.getByText("Header")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Reservation Table"
            )
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: /create reservation/i,
            })
        );

        expect(
            screen.getByText("Header")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Reservation Table"
            )
        ).toBeInTheDocument();
    });
});