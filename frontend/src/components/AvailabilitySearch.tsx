import SearchIcon from "@mui/icons-material/Search";
import {
    Button,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";

import type { CarType } from "../models/CarType";

type AvailabilitySearchProps = {
    onSearch: (
        carType: CarType,
        startDateTime: string,
        endDate: string
    ) => void;
};

function formatLocalDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDays(
    dateString: string,
    days: number
): string {
    const date = new Date(`${dateString}T00:00:00`);

    date.setDate(date.getDate() + days);

    return formatLocalDate(date);
}

function AvailabilitySearch({
                                onSearch,
                            }: AvailabilitySearchProps) {
    const [carType, setCarType] =
        useState<CarType | "">("");

    const [startDateTime, setStartDateTime] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [minimumStartDateTime] =
        useState(() =>
            formatLocalDateTime(new Date())
        );

    const startDate = startDateTime
        ? startDateTime.split("T")[0]
        : "";

    const hasValidStartDateTime =
        startDateTime !== "" &&
        startDate !== "";

    const minimumEndDate =
        hasValidStartDateTime
            ? addDays(startDate, 1)
            : "";

    const isSearchDisabled =
        !carType ||
        !hasValidStartDateTime ||
        !endDate ||
        startDateTime < minimumStartDateTime ||
        endDate < minimumEndDate;

    const isResetDisabled =
        !carType &&
        !startDateTime &&
        !endDate;

    const handleCarTypeChange = (
        value: CarType | ""
    ) => {
        setCarType(value);

        if (!value) {
            setStartDateTime("");
            setEndDate("");
        }
    };

    const handleStartDateTimeChange = (
        value: string
    ) => {
        setStartDateTime(value);

        if (!value) {
            setEndDate("");
            return;
        }

        const selectedStartDate =
            value.split("T")[0];

        if (!selectedStartDate) {
            setEndDate("");
            return;
        }

        const newMinimumEndDate =
            addDays(selectedStartDate, 1);

        if (
            endDate &&
            endDate < newMinimumEndDate
        ) {
            setEndDate("");
        }
    };

    const handleReset = () => {
        setCarType("");
        setStartDateTime("");
        setEndDate("");
    };

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            isSearchDisabled ||
            !carType
        ) {
            return;
        }

        onSearch(
            carType,
            startDateTime,
            endDate
        );
    };

    return (
        <Stack
            component="form"
            spacing={3}
            onSubmit={handleSubmit}
            sx={{
                width: "100%",
                alignItems: "center",
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                sx={{
                    textAlign: "center",
                }}
            >
                Find a Car
            </Typography>

            <TextField
                select
                label="Car type"
                value={carType}
                onChange={(event) =>
                    handleCarTypeChange(
                        event.target.value as CarType | ""
                    )
                }
                fullWidth
                required
            >
                <MenuItem value="SEDAN">
                    Sedan
                </MenuItem>

                <MenuItem value="SUV">
                    SUV
                </MenuItem>

                <MenuItem value="VAN">
                    Van
                </MenuItem>
            </TextField>

            <TextField
                label="Pick-up date and time"
                type="datetime-local"
                value={startDateTime}
                onChange={(event) =>
                    handleStartDateTimeChange(
                        event.target.value
                    )
                }
                disabled={!carType}
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                    htmlInput: {
                        min: minimumStartDateTime,
                    },
                }}
                fullWidth
                required
            />

            <TextField
                label="Return date"
                type="date"
                value={endDate}
                onChange={(event) =>
                    setEndDate(event.target.value)
                }
                disabled={
                    !carType ||
                    !hasValidStartDateTime
                }
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                    htmlInput: {
                        min: minimumEndDate,
                    },
                }}
                fullWidth
                required
            />

            <Stack
                direction="row"
                spacing={2}
            >
                <Button
                    type="button"
                    variant="outlined"
                    onClick={handleReset}
                    disabled={isResetDisabled}
                >
                    Reset
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SearchIcon />}
                    disabled={isSearchDisabled}
                >
                    Search availability
                </Button>
            </Stack>
        </Stack>
    );
}

export default AvailabilitySearch;