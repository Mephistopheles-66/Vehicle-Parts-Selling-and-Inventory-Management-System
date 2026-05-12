/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CreateVendorDto } from '../models/CreateVendorDto';
import type { UpdateVendorDto } from '../models/UpdateVendorDto';
import type { VendorDtoListResponseDto } from '../models/VendorDtoListResponseDto';
import type { VendorDtoResponseDto } from '../models/VendorDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VendorsService {
    /**
     * GetAllVendors
     * Retrieve all vendors.
     * @returns VendorDtoListResponseDto OK
     * @throws ApiError
     */
    public static getAllVendors(): CancelablePromise<VendorDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vendors',
        });
    }
    /**
     * CreateVendor
     * Create a new vendor.
     * @returns VendorDtoResponseDto OK
     * @throws ApiError
     */
    public static createVendor({
        requestBody,
    }: {
        requestBody?: CreateVendorDto,
    }): CancelablePromise<VendorDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/vendors',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetVendorById
     * Retrieve a vendor by identifier.
     * @returns VendorDtoResponseDto OK
     * @throws ApiError
     */
    public static getVendorById({
        vendorId,
    }: {
        vendorId: string,
    }): CancelablePromise<VendorDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/vendors/{vendorId}',
            path: {
                'vendorId': vendorId,
            },
        });
    }
    /**
     * UpdateVendor
     * Update an existing vendor.
     * @returns VendorDtoResponseDto OK
     * @throws ApiError
     */
    public static updateVendor({
        vendorId,
        requestBody,
    }: {
        vendorId: string,
        requestBody?: UpdateVendorDto,
    }): CancelablePromise<VendorDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/vendors/{vendorId}',
            path: {
                'vendorId': vendorId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * DeleteVendor
     * Delete a vendor.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static deleteVendor({
        vendorId,
    }: {
        vendorId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/vendors/{vendorId}',
            path: {
                'vendorId': vendorId,
            },
        });
    }
}
