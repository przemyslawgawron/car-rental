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

import AvailabilitySearchInfo from "./AvailabilitySearchInfo";

describe("AvailabilitySearchInfo", () => {
    it("renders the info title", () => {
        render(
            <AvailabilitySearchInfo
                message="No vehicles found."
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByRole("heading", {
                name: "No Vehicles Available",
            })
        ).toBeInTheDocument();
    });

    it("renders the message", () => {
        render(
            <AvailabilitySearchInfo
                message="No vehicles are available for the selected rental period."
                onClose={vi.fn()}
            />
        );

        expect(
            screen.getByText(
                "No vehicles are available for the selected rental period."
            )
        ).toBeInTheDocument();
    });

    it("calls onClose when back button is clicked", async () => {
        const user = userEvent.setup();

        const onClose = vi.fn();

        render(
            <AvailabilitySearchInfo
                message="No vehicles found."
                onClose={onClose}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: /back/i,
            })
        );

        expect(
            onClose
        ).toHaveBeenCalledTimes(1);
    });
});