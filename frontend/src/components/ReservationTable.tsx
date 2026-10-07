import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { Reservation } from "../models/Reservation";
import { ReservationService } from "../services/ReservationService";

type ReservationTableProps = {
    refreshKey?: string;
};

type ReservationsResponse = {
    reservations: Reservation[];
};

const reservationService = new ReservationService();

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

function ReservationTable({
                              refreshKey,
                          }: ReservationTableProps) {
    const [reservations, setReservations] =
        useState<Reservation[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        const abortController =
            new AbortController();

        const loadReservations = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response: ReservationsResponse =
                    await reservationService.getReservations(
                        abortController.signal
                    );

                setReservations(
                    response.reservations
                );
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                if (error instanceof Error) {
                    setError(error.message);
                    return;
                }

                setError(
                    "Unable to load reservations."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadReservations();

        return () => {
            abortController.abort();
        };
    }, [refreshKey]);

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await reservationService.deleteReservations();

            setReservations([]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
                return;
            }

            setError(
                "Unable to delete reservations."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card
            variant="outlined"
            sx={{
                mx: 4,
                mb: 4,
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                    >
                        Reservations
                    </Typography>

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleDeleteAll}
                        disabled={
                            isDeleting ||
                            reservations.length === 0
                        }
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Delete all"}
                    </Button>
                </Stack>

                {isLoading && (
                    <CircularProgress size={24} />
                )}

                {!isLoading && error && (
                    <Typography
                        variant="body2"
                        color="error"
                    >
                        {error}
                    </Typography>
                )}

                {!isLoading &&
                    !error &&
                    reservations.length === 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No reservations yet.
                        </Typography>
                    )}

                {!isLoading &&
                    !error &&
                    reservations.length > 0 && (
                        <TableContainer
                            sx={{
                                maxHeight: 240,
                            }}
                        >
                            <Table
                                stickyHeader
                                size="small"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Car Type
                                        </TableCell>

                                        <TableCell>
                                            Vehicle ID
                                        </TableCell>

                                        <TableCell>
                                            Start
                                        </TableCell>

                                        <TableCell>
                                            End
                                        </TableCell>

                                        <TableCell>
                                            Days
                                        </TableCell>

                                        <TableCell>
                                            Reservation ID
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {reservations.map(
                                        reservation => (
                                            <TableRow
                                                key={
                                                    reservation.id
                                                }
                                                hover
                                            >
                                                <TableCell>
                                                    {
                                                        reservation.carType
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        reservation.vehicleId
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {formatDateTime(
                                                        reservation.startDateTime
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {formatDate(
                                                        reservation.endDate
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        reservation.numberOfDays
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        reservation.id
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
            </CardContent>
        </Card>
    );
}

export default ReservationTable;