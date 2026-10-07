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

import AvailabilitySearchLoading from "./AvailabilitySearchLoading";

describe("AvailabilitySearchLoading", () => {
    it("renders the loading indicator", () => {
        render(
            <AvailabilitySearchLoading
                onCancel={vi.fn()}
            />
        );

        expect(
            screen.getByRole("progressbar")
        ).toBeInTheDocument();
    });

    it("renders the loading message", () => {
        render(
            <AvailabilitySearchLoading
                onCancel={vi.fn()}
            />
        );

        expect(
            screen.getByText(
                "Checking availability..."
            )
        ).toBeInTheDocument();
    });

    it("calls onCancel when cancel button is clicked", async () => {
        const user = userEvent.setup();

        const onCancel = vi.fn();

        render(
            <AvailabilitySearchLoading
                onCancel={onCancel}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: /cancel/i,
            })
        );

        expect(
            onCancel
        ).toHaveBeenCalledTimes(1);
    });
});