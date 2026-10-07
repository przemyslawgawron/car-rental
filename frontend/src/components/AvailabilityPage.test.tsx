import {
    fireEvent,
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

import AvailabilityPage from "./AvailabilityPage";

import type { AvailabilitySearchResult } from "../models/AvailabilitySearchResult";

const { getAvailabilityMock } = vi.hoisted(() => ({
    getAvailabilityMock: vi.fn(),
}));

vi.mock("../services/AvailabilityService", () => ({
    AvailabilityService: class {
        getAvailability = getAvailabilityMock;
    },
}));

function getStartDateTimeInput(): HTMLInputElement {
    const input = document.querySelector(
        'input[type="datetime-local"]'
    );

    if (!(input instanceof HTMLInputElement)) {
        throw new Error(
            "Pick-up date/time input not found."
        );
    }

    return input;
}

function getEndDateInput(): HTMLInputElement {
    const input = document.querySelector(
        'input[type="date"]'
    );

    if (!(input instanceof HTMLInputElement)) {
        throw new Error(
            "Return date input not found."
        );
    }

    return input;
}

async function selectCarType(
    user: ReturnType<typeof userEvent.setup>,
    optionName: string
) {
    await user.click(
        screen.getByRole("combobox")
    );

    await user.click(
        screen.getByRole("option", {
            name: optionName,
        })
    );
}

function enterDates() {
    fireEvent.change(
        getStartDateTimeInput(),
        {
            target: {
                value: "2099-10-10T10:00",
            },
        }
    );

    fireEvent.change(
        getEndDateInput(),
        {
            target: {
                value: "2099-10-13",
            },
        }
    );
}

describe("AvailabilityPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the availability search form", () => {
        render(
            <AvailabilityPage
                onAvailabilityFound={vi.fn()}
            />
        );

        expect(
            screen.getByText("Find a Car")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("combobox")
        ).toBeInTheDocument();

        expect(
            getStartDateTimeInput()
        ).toBeInTheDocument();

        expect(
            getEndDateInput()
        ).toBeInTheDocument();
    });

    it("calls onAvailabilityFound when vehicles are available", async () => {
        const user = userEvent.setup();

        const onAvailabilityFound = vi.fn();

        const result: AvailabilitySearchResult = {
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

        getAvailabilityMock.mockResolvedValue(
            result
        );

        render(
            <AvailabilityPage
                onAvailabilityFound={
                    onAvailabilityFound
                }
            />
        );

        await selectCarType(
            user,
            "Sedan"
        );

        enterDates();

        await user.click(
            screen.getByRole("button", {
                name: /search availability/i,
            })
        );

        await waitFor(() => {
            expect(
                getAvailabilityMock
            ).toHaveBeenCalledWith(
                "SEDAN",
                "2099-10-10T10:00",
                "2099-10-13",
                expect.any(AbortSignal)
            );
        });

        expect(
            onAvailabilityFound
        ).toHaveBeenCalledWith(result);
    });

    it("shows an info message when no vehicles are available", async () => {
        const user = userEvent.setup();

        const onAvailabilityFound = vi.fn();

        const result: AvailabilitySearchResult = {
            startDateTime: "2099-10-10T10:00",
            endDate: "2099-10-13",
            numberOfDays: 3,
            availableVehicles: [],
        };

        getAvailabilityMock.mockResolvedValue(
            result
        );

        render(
            <AvailabilityPage
                onAvailabilityFound={
                    onAvailabilityFound
                }
            />
        );

        await selectCarType(
            user,
            "Sedan"
        );

        enterDates();

        await user.click(
            screen.getByRole("button", {
                name: /search availability/i,
            })
        );

        expect(
            await screen.findByText(
                "No Vehicles Available"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /no vehicles are available for the selected rental period/i
            )
        ).toBeInTheDocument();

        expect(
            onAvailabilityFound
        ).not.toHaveBeenCalled();
    });

    it("shows an error when availability request fails", async () => {
        const user = userEvent.setup();

        getAvailabilityMock.mockRejectedValue(
            new Error("Backend unavailable")
        );

        render(
            <AvailabilityPage
                onAvailabilityFound={vi.fn()}
            />
        );

        await selectCarType(
            user,
            "SUV"
        );

        enterDates();

        await user.click(
            screen.getByRole("button", {
                name: /search availability/i,
            })
        );

        expect(
            await screen.findByText(
                "Unable to check availability."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Please try again."
            )
        ).toBeInTheDocument();
    });

    it("shows loading while availability request is pending", async () => {
        const user = userEvent.setup();

        getAvailabilityMock.mockReturnValue(
            new Promise(() => {
                // Intentionally unresolved.
            })
        );

        render(
            <AvailabilityPage
                onAvailabilityFound={vi.fn()}
            />
        );

        await selectCarType(
            user,
            "Van"
        );

        enterDates();

        await user.click(
            screen.getByRole("button", {
                name: /search availability/i,
            })
        );

        expect(
            await screen.findByRole(
                "progressbar"
            )
        ).toBeInTheDocument();
    });
});