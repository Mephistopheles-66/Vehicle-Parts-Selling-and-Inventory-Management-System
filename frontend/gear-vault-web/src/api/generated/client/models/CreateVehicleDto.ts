/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FuelType } from './FuelType';
export type CreateVehicleDto = {
    userId?: string;
    vehicleNumber?: string | null;
    licenseNumber?: string | null;
    make?: string | null;
    model?: string | null;
    year?: number;
    fuelType?: FuelType;
};

