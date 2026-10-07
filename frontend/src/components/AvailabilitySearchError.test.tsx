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

import AvailabilitySearchError from "./AvailabilitySearchError";

describe("AvailabilitySearchError", () => {
    it("renders the error title", () => {
        render(
            <AvailabilitySearchError
                messages={[]}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByRole("heading", {
                name: "Error",
            })
        ).toBeInTheDocument();
    });

    it("renders all error messages", () => {
        render(
            <AvailabilitySearchError
                messages={[
                    "Unable to check availability.",
                    "Please try again.",
                ]}
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByText(
                "Unable to check availability."
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                "Please try again."
            )
        ).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", async () => {
        const user = userEvent.setup();

        const onClose = vi.fn();

        render(
            <AvailabilitySearchError
                messages={[
                    "Unable to check availability.",
                ]}
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