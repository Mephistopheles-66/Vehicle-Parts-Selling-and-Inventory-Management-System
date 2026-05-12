/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FuelType } from './FuelType';
import type { UserDto } from './UserDto';
export type VehicleDto = {
    id?: string;
    isActive?: boolean;
    customer?: UserDto;
    vehicleNumber?: string | null;
    licenseNumber?: string | null;
    make?: string | null;
    model?: string | null;
    year?: number;
    fuelType?: FuelType;
};

