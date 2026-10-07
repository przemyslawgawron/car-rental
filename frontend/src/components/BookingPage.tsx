import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";

import type { AvailabilitySearchResult } from "../models/AvailabilitySearchResult";
import type { Reservation } from "../models/Reservation";

import { ReservationService } from "../services/ReservationService";
import BookingError from "./BookingError";

const reservationService = new ReservationService();

type BookingPageProps = {
    result: AvailabilitySearchResult;
    onBack: () => void;
    onReservationCreated: (reservation: Reservation) => void;
};

function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
    }).format(new Date(`${value}T00:00:00`));
}

function BookingPage({
                         result,
                         onBack,
                         onReservationCreated,
                     }: BookingPageProps) {
    const [reservingVehicleId, setReservingVehicleId] =
        useState<string | null>(null);

    const [errors, setErrors] = useState<string[]>([]);

    const {
        startDateTime,
        endDate,
        numberOfDays,
        availableVehicles,
    } = result;

    const handleReserve = async (vehicleId: string) => {
        setReservingVehicleId(vehicleId);
        setErrors([]);

        try {
            const reservation =
                await reservationService.createReservation({
                    vehicleId,
                    startDateTime,
                    endDate,
                });

            onReservationCreated(reservation);
        } catch {
            setErrors([
                "Unable to create reservation.",
                "Please try again.",
            ]);
        } finally {
            setReservingVehicleId(null);
        }
    };

    const handleErrorClose = () => {
        setErrors([]);
    };

    if (errors.length > 0) {
        return (
            <Container
                maxWidth="sm"
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        width: "100%",
                        p: 4,
                    }}
                >
                    <BookingError
                        messages={errors}
                        onClose={handleErrorClose}
                    />
                </Paper>
            </Container>
        );
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    p: 4,
                }}
            >
                <Stack spacing={3}>
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        Available Cars
                    </Typography>

                    <Stack spacing={2}>
                        <Stack
                            direction="row"
                            spacing={4}
                            sx={{
                                justifyContent: "space-between",
                            }}
                        >
                            <Stack
                                spacing={0.5}
                                sx={{
                                    flex: 1,
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Start Date / Time
                                </Typography>

                                <Typography variant="body1">
                                    {formatDateTime(startDateTime)}
                                </Typography>
                            </Stack>

                            <Stack
                                spacing={0.5}
                                sx={{
                                    flex: 1,
                                    textAlign: "center",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    End Date
                                </Typography>

                                <Typography variant="body1">
                                    {formatDate(endDate)}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack
                            spacing={0.5}
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Rental Duration
                            </Typography>

                            <Typography variant="body1">
                                {numberOfDays}{" "}
                                {numberOfDays === 1
                                    ? "day"
                                    : "days"}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack spacing={2}>
                        {availableVehicles.map((vehicle) => {
                            const isReserving =
                                reservingVehicleId === vehicle.id;

                            return (
                                <Card
                                    key={vehicle.id}
                                    variant="outlined"
                                >
                                    <CardContent>
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            sx={{
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Stack spacing={0.5}>
                                                <Typography variant="h6">
                                                    {vehicle.carType}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Vehicle ID: {vehicle.id}
                                                </Typography>
                                            </Stack>

                                            <Button
                                                variant="contained"
                                                disabled={
                                                    reservingVehicleId !== null
                                                }
                                                onClick={() =>
                                                    handleReserve(vehicle.id)
                                                }
                                                sx={{
                                                    minWidth: 120,
                                                }}
                                            >
                                                {isReserving ? (
                                                    <CircularProgress
                                                        size={22}
                                                        color="inherit"
                                                    />
                                                ) : (
                                                    "Reserve"
                                                )}
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>

                    {availableVehicles.length === 0 && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            No vehicles are available for the selected dates.
                        </Typography>
                    )}

                    <Button
                        variant="outlined"
                        onClick={onBack}
                        disabled={reservingVehicleId !== null}
                    >
                        Back
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

export default BookingPage;