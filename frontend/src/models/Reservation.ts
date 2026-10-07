import type { CarType } from "./CarType";

export type Reservation = {
    id: string;
    vehicleId: string;
    carType: CarType;
    startDateTime: string;
    endDate: string;
    numberOfDays: number;
};