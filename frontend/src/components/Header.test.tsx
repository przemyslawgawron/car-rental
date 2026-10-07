import {
    render,
    screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import Header from "./Header";

const {
    toggleThemeMock,
    useThemeModeMock,
} = vi.hoisted(() => ({
    toggleThemeMock: vi.fn(),
    useThemeModeMock: vi.fn(),
}));

vi.mock("../theme/ThemeContext", () => ({
    useThemeMode: useThemeModeMock,
}));

describe("Header", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        useThemeModeMock.mockReturnValue({
            mode: "light",
            toggleTheme: toggleThemeMock,
        });
    });

    it("renders the application title", () => {
        render(
            <Header />
        );

        expect(
            screen.getByRole("heading", {
                name: "Car Rental",
            })
        ).toBeInTheDocument();
    });

    it("shows switch to dark mode when current mode is light", () => {
        render(
            <Header />
        );

        expect(
            screen.getByRole("button", {
                name: /switch to dark mode/i,
            })
        ).toBeInTheDocument();
    });

    it("shows switch to light mode when current mode is dark", () => {
        useThemeModeMock.mockReturnValue({
            mode: "dark",
            toggleTheme: toggleThemeMock,
        });

        render(
            <Header />
        );

        expect(
            screen.getByRole("button", {
                name: /switch to light mode/i,
            })
        ).toBeInTheDocument();
    });

    it("calls toggleTheme when theme button is clicked", async () => {
        const user = userEvent.setup();

        render(
            <Header />
        );

        await user.click(
            screen.getByRole("button", {
                name: /switch to dark mode/i,
            })
        );

        expect(
            toggleThemeMock
        ).toHaveBeenCalledTimes(1);
    });
});