import type { Vehicle } from "./Vehicle";

export type AvailabilitySearchResult = {
    startDateTime: string;
    endDate: string;
    numberOfDays: number;
    availableVehicles: Vehicle[];
};