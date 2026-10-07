import { Box } from "@mui/material";
import { useState } from "react";

import Header from "./components/Header";
import AvailabilityPage from "./components/AvailabilityPage";
import BookingPage from "./components/BookingPage";
import ReservationPage from "./components/ReservationPage";
import ReservationTable from "./components/ReservationTable";

import type { AvailabilitySearchResult } from "./models/AvailabilitySearchResult";
import type { Reservation } from "./models/Reservation";

type View =
    | "availability"
    | "booking"
    | "reservation";

function App() {
    const [view, setView] =
        useState<View>("availability");

    const [availabilityResult, setAvailabilityResult] =
        useState<AvailabilitySearchResult | null>(null);

    const [reservation, setReservation] =
        useState<Reservation | null>(null);

    const handleAvailabilityFound = (
        result: AvailabilitySearchResult
    ) => {
        setAvailabilityResult(result);
        setView("booking");
    };

    const handleReservationCreated = (
        createdReservation: Reservation
    ) => {
        setReservation(createdReservation);
        setView("reservation");
    };

    const handleBackToSearch = () => {
        setAvailabilityResult(null);
        setView("availability");
    };

    const handleReservationClose = () => {
        setReservation(null);
        setAvailabilityResult(null);
        setView("availability");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Header />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {view === "availability" && (
                    <AvailabilityPage
                        onAvailabilityFound={
                            handleAvailabilityFound
                        }
                    />
                )}

                {view === "booking" &&
                    availabilityResult && (
                        <BookingPage
                            result={availabilityResult}
                            onBack={handleBackToSearch}
                            onReservationCreated={
                                handleReservationCreated
                            }
                        />
                    )}

                {view === "reservation" &&
                    reservation && (
                        <ReservationPage
                            reservation={reservation}
                            onClose={
                                handleReservationClose
                            }
                        />
                    )}
            </Box>

            <ReservationTable
                refreshKey={reservation?.id}
            />
        </Box>
    );
}

export default App;