/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CreatePartRequestDto } from '../models/CreatePartRequestDto';
import type { PartRequestDtoListResponseDto } from '../models/PartRequestDtoListResponseDto';
import type { PartRequestDtoResponseDto } from '../models/PartRequestDtoResponseDto';
import type { UpdatePartRequestDto } from '../models/UpdatePartRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PartRequestsService {
    /**
     * GetMyPartRequests
     * Retrieve all part requests submitted by the current user.
     * @returns PartRequestDtoListResponseDto OK
     * @throws ApiError
     */
    public static getMyPartRequests(): CancelablePromise<PartRequestDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/part-requests',
        });
    }
    /**
     * CreatePartRequest
     * Submit a new part request.
     * @returns PartRequestDtoResponseDto OK
     * @throws ApiError
     */
    public static createPartRequest({
        requestBody,
    }: {
        requestBody?: CreatePartRequestDto,
    }): CancelablePromise<PartRequestDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/part-requests',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetPartRequestById
     * Retrieve a part request by identifier.
     * @returns PartRequestDtoResponseDto OK
     * @throws ApiError
     */
    public static getPartRequestById({
        partRequestId,
    }: {
        partRequestId: string,
    }): CancelablePromise<PartRequestDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/part-requests/{partRequestId}',
            path: {
                'partRequestId': partRequestId,
            },
        });
    }
    /**
     * UpdatePartRequest
     * Update an existing part request.
     * @returns PartRequestDtoResponseDto OK
     * @throws ApiError
     */
    public static updatePartRequest({
        partRequestId,
        requestBody,
    }: {
        partRequestId: string,
        requestBody?: UpdatePartRequestDto,
    }): CancelablePromise<PartRequestDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/part-requests/{partRequestId}',
            path: {
                'partRequestId': partRequestId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * DeletePartRequest
     * Delete a part request.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static deletePartRequest({
        partRequestId,
    }: {
        partRequestId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/part-requests/{partRequestId}',
            path: {
                'partRequestId': partRequestId,
            },
        });
    }
}
