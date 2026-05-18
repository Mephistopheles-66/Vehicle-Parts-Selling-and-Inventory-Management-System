/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CreateVehicleDto } from '../models/CreateVehicleDto';
import type { UpdateVehicleDto } from '../models/UpdateVehicleDto';
import type { VehicleDtoListResponseDto } from '../models/VehicleDtoListResponseDto';
import type { VehicleDtoResponseDto } from '../models/VehicleDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VehiclesService {
    /**
     * GetMyVehicles
     * Retrieve all vehicles belonging to the logged in customer.
     * @returns VehicleDtoListResponseDto OK
     * @throws ApiError
     */
    public static getMyVehicles(): CancelablePromise<VehicleDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vehicles',
        });
    }
    /**
     * CreateVehicle
     * Register a new vehicle for the logged in customer.
     * @returns VehicleDtoResponseDto OK
     * @throws ApiError
     */
    public static createVehicle({
        requestBody,
    }: {
        requestBody?: CreateVehicleDto,
    }): CancelablePromise<VehicleDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/vehicles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetVehicleById
     * Retrieve a vehicle by identifier.
     * @returns VehicleDtoResponseDto OK
     * @throws ApiError
     */
    public static getVehicleById({
        vehicleId,
    }: {
        vehicleId: string,
    }): CancelablePromise<VehicleDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vehicles/{vehicleId}',
            path: {
                'vehicleId': vehicleId,
            },
        });
    }
    /**
     * UpdateVehicle
     * Update an existing vehicle.
     * @returns VehicleDtoResponseDto OK
     * @throws ApiError
     */
    public static updateVehicle({
        vehicleId,
        requestBody,
    }: {
        vehicleId: string,
        requestBody?: UpdateVehicleDto,
    }): CancelablePromise<VehicleDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/vehicles/{vehicleId}',
            path: {
                'vehicleId': vehicleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * DeleteVehicle
     * Delete a vehicle.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static deleteVehicle({
        vehicleId,
    }: {
        vehicleId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/vehicles/{vehicleId}',
            path: {
                'vehicleId': vehicleId,
            },
        });
    }
    /**
     * GetVehiclesByCustomerId
     * Retrieve all vehicles owned by a given customer. Staff-only.
     * @returns VehicleDtoListResponseDto OK
     * @throws ApiError
     */
    public static getVehiclesByCustomerId({
        customerId,
    }: {
        customerId: string,
    }): CancelablePromise<VehicleDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vehicles/by-customer/{customerId}',
            path: {
                'customerId': customerId,
            },
        });
    }
}
