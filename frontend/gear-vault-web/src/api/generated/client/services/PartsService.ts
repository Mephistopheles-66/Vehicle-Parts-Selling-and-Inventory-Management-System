/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CreatePartDto } from '../models/CreatePartDto';
import type { PartDtoListResponseDto } from '../models/PartDtoListResponseDto';
import type { PartDtoResponseDto } from '../models/PartDtoResponseDto';
import type { UpdatePartDto } from '../models/UpdatePartDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PartsService {
    /**
     * GetAllParts
     * Retrieve all parts.
     * @returns PartDtoListResponseDto OK
     * @throws ApiError
     */
    public static getAllParts(): CancelablePromise<PartDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parts',
        });
    }
    /**
     * CreatePart
     * Create a new part.
     * @returns PartDtoResponseDto OK
     * @throws ApiError
     */
    public static createPart({
        requestBody,
    }: {
        requestBody?: CreatePartDto,
    }): CancelablePromise<PartDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/parts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetPartById
     * Retrieve a part by identifier.
     * @returns PartDtoResponseDto OK
     * @throws ApiError
     */
    public static getPartById({
        partId,
    }: {
        partId: string,
    }): CancelablePromise<PartDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/parts/{partId}',
            path: {
                'partId': partId,
            },
        });
    }
    /**
     * UpdatePart
     * Update an existing part.
     * @returns PartDtoResponseDto OK
     * @throws ApiError
     */
    public static updatePart({
        partId,
        requestBody,
    }: {
        partId: string,
        requestBody?: UpdatePartDto,
    }): CancelablePromise<PartDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/parts/{partId}',
            path: {
                'partId': partId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * DeletePart
     * Delete a part.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static deletePart({
        partId,
    }: {
        partId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/parts/{partId}',
            path: {
                'partId': partId,
            },
        });
    }
}
