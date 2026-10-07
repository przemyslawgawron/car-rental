import { Container, Paper } from "@mui/material";
import { useRef, useState } from "react";

import AvailabilitySearch from "./AvailabilitySearch";
import AvailabilitySearchLoading from "./AvailabilitySearchLoading";
import AvailabilitySearchError from "./AvailabilitySearchError";
import AvailabilitySearchInfo from "./AvailabilitySearchInfo";

import { AvailabilityService } from "../services/AvailabilityService";
import type { AvailabilitySearchResult } from "../models/AvailabilitySearchResult";
import type { CarType } from "../models/CarType";

const availabilityService = new AvailabilityService();

type AvailabilityPageProps = {
    onAvailabilityFound: (
        result: AvailabilitySearchResult
    ) => void;
};

function AvailabilityPage({
                              onAvailabilityFound,
                          }: AvailabilityPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);

    const abortControllerRef =
        useRef<AbortController | null>(null);

    const handleSearch = async (
        carType: CarType,
        startDateTime: string,
        endDate: string
    ) => {
        const controller = new AbortController();

        abortControllerRef.current = controller;

        setIsLoading(true);
        setErrors([]);
        setInfoMessage(null);

        try {
            const result =
                await availabilityService.getAvailability(
                    carType,
                    startDateTime,
                    endDate,
                    controller.signal
                );

            if (result.availableVehicles.length === 0) {
                setInfoMessage(
                    "No vehicles are available for the selected rental period. Please try another vehicle type or date range."
                );

                return;
            }

            onAvailabilityFound(result);
        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name === "AbortError"
            ) {
                return;
            }

            setErrors([
                "Unable to check availability.",
                "Please try again.",
            ]);
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const handleCancel = () => {
        abortControllerRef.current?.abort();

        setIsLoading(false);
        setErrors([]);
        setInfoMessage(null);
    };

    const handleErrorClose = () => {
        setErrors([]);
        setIsLoading(false);
    };

    const handleInfoClose = () => {
        setInfoMessage(null);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <AvailabilitySearchLoading
                    onCancel={handleCancel}
                />
            );
        }

        if (errors.length > 0) {
            return (
                <AvailabilitySearchError
                    messages={errors}
                    onClose={handleErrorClose}
                />
            );
        }

        if (infoMessage) {
            return (
                <AvailabilitySearchInfo
                    message={infoMessage}
                    onClose={handleInfoClose}
                />
            );
        }

        return (
            <AvailabilitySearch
                onSearch={handleSearch}
            />
        );
    };

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
                {renderContent()}
            </Paper>
        </Container>
    );
}

export default AvailabilityPage;