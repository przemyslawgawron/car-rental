import {
    fireEvent,
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

import AvailabilitySearch from "./AvailabilitySearch";

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

describe("AvailabilitySearch", () => {
    it("renders the search form", () => {
        render(
            <AvailabilitySearch
                onSearch={vi.fn()}
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

        expect(
            screen.getByRole("button", {
                name: /search availability/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /reset/i,
            })
        ).toBeInTheDocument();
    });

    it("disables date fields until required previous values are selected", async () => {
        const user = userEvent.setup();

        render(
            <AvailabilitySearch
                onSearch={vi.fn()}
            />
        );

        const startDateTimeInput =
            getStartDateTimeInput();

        const endDateInput =
            getEndDateInput();

        expect(
            startDateTimeInput
        ).toBeDisabled();

        expect(
            endDateInput
        ).toBeDisabled();

        await selectCarType(
            user,
            "Sedan"
        );

        expect(
            startDateTimeInput
        ).not.toBeDisabled();

        expect(
            endDateInput
        ).toBeDisabled();

        fireEvent.change(
            startDateTimeInput,
            {
                target: {
                    value: "2099-10-10T10:00",
                },
            }
        );

        expect(
            endDateInput
        ).not.toBeDisabled();
    });

    it("keeps search disabled until all required values are valid", async () => {
        const user = userEvent.setup();

        render(
            <AvailabilitySearch
                onSearch={vi.fn()}
            />
        );

        const searchButton =
            screen.getByRole("button", {
                name: /search availability/i,
            });

        expect(
            searchButton
        ).toBeDisabled();

        await selectCarType(
            user,
            "SUV"
        );

        expect(
            searchButton
        ).toBeDisabled();

        fireEvent.change(
            getStartDateTimeInput(),
            {
                target: {
                    value: "2099-10-10T10:00",
                },
            }
        );

        expect(
            searchButton
        ).toBeDisabled();

        fireEvent.change(
            getEndDateInput(),
            {
                target: {
                    value: "2099-10-13",
                },
            }
        );

        expect(
            searchButton
        ).not.toBeDisabled();
    });

    it("calls onSearch with selected values", async () => {
        const user = userEvent.setup();

        const onSearch = vi.fn();

        render(
            <AvailabilitySearch
                onSearch={onSearch}
            />
        );

        await selectCarType(
            user,
            "Van"
        );

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

        await user.click(
            screen.getByRole("button", {
                name: /search availability/i,
            })
        );

        expect(
            onSearch
        ).toHaveBeenCalledTimes(1);

        expect(
            onSearch
        ).toHaveBeenCalledWith(
            "VAN",
            "2099-10-10T10:00",
            "2099-10-13"
        );
    });

    it("clears the form when reset is clicked", async () => {
        const user = userEvent.setup();

        render(
            <AvailabilitySearch
                onSearch={vi.fn()}
            />
        );

        await selectCarType(
            user,
            "Sedan"
        );

        const startDateTimeInput =
            getStartDateTimeInput();

        const endDateInput =
            getEndDateInput();

        fireEvent.change(
            startDateTimeInput,
            {
                target: {
                    value: "2099-10-10T10:00",
                },
            }
        );

        fireEvent.change(
            endDateInput,
            {
                target: {
                    value: "2099-10-13",
                },
            }
        );

        await user.click(
            screen.getByRole("button", {
                name: /reset/i,
            })
        );

        expect(
            screen.getByRole("combobox")
        ).toHaveAttribute("aria-expanded", "false");

        expect(
            startDateTimeInput.value
        ).toBe("");

        expect(
            endDateInput.value
        ).toBe("");

        expect(
            startDateTimeInput
        ).toBeDisabled();

        expect(
            endDateInput
        ).toBeDisabled();
    });

    it("clears return date when start date moves past it", async () => {
        const user = userEvent.setup();

        render(
            <AvailabilitySearch
                onSearch={vi.fn()}
            />
        );

        await selectCarType(
            user,
            "Sedan"
        );

        const startDateTimeInput =
            getStartDateTimeInput();

        const endDateInput =
            getEndDateInput();

        fireEvent.change(
            startDateTimeInput,
            {
                target: {
                    value: "2099-10-10T10:00",
                },
            }
        );

        fireEvent.change(
            endDateInput,
            {
                target: {
                    value: "2099-10-13",
                },
            }
        );

        expect(
            endDateInput.value
        ).toBe("2099-10-13");

        fireEvent.change(
            startDateTimeInput,
            {
                target: {
                    value: "2099-10-15T10:00",
                },
            }
        );

        expect(
            endDateInput.value
        ).toBe("");
    });

    it("requires return date to be at least one day after start date", async () => {
        const user = userEvent.setup();

        render(
            <AvailabilitySearch
                onSearch={vi.fn()}
            />
        );

        await selectCarType(
            user,
            "SUV"
        );

        fireEvent.change(
            getStartDateTimeInput(),
            {
                target: {
                    value: "2099-10-10T10:00",
                },
            }
        );

        const endDateInput =
            getEndDateInput();

        expect(
            endDateInput
        ).toHaveAttribute(
            "min",
            "2099-10-11"
        );
    });
});