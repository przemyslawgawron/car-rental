import {
    Button,
    Card,
    CardContent,
    Container,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import type { Reservation } from "../models/Reservation";

type ReservationPageProps = {
    reservation: Reservation;
    onClose: () => void;
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

function ReservationPage({
                             reservation,
                             onClose,
                         }: ReservationPageProps) {
    const {
        id,
        vehicleId,
        carType,
        startDateTime,
        endDate,
        numberOfDays,
    } = reservation;

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
                        Reservation Confirmed
                    </Typography>

                    <Card variant="outlined">
                        <CardContent>
                            <Stack spacing={2}>
                                <Stack spacing={0.5}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Car Type
                                    </Typography>

                                    <Typography variant="h6">
                                        {carType}
                                    </Typography>
                                </Stack>

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

                                <Stack spacing={0.5}>
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

                                <Stack spacing={0.5}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Vehicle ID
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {vehicleId}
                                    </Typography>
                                </Stack>

                                <Stack spacing={0.5}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Reservation ID
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {id}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Button
                        variant="contained"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}

export default ReservationPage;