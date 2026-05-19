/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CreatePartFailurePredictionDto } from '../models/CreatePartFailurePredictionDto';
import type { PartFailurePredictionDtoListResponseDto } from '../models/PartFailurePredictionDtoListResponseDto';
import type { PartFailurePredictionDtoResponseDto } from '../models/PartFailurePredictionDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiVehicleHealthService {
    public static generateVehicleHealthPrediction({
        vehicleId,
        requestBody,
    }: {
        vehicleId: string,
        requestBody?: CreatePartFailurePredictionDto,
    }): CancelablePromise<PartFailurePredictionDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ai/vehicle/health/vehicles/{vehicleId}/predict',
            path: { 'vehicleId': vehicleId },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static getMyVehicleHealthPredictions(): CancelablePromise<PartFailurePredictionDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ai/vehicle/health/predictions/my',
        });
    }

    public static getVehicleHealthPredictionsByVehicle({
        vehicleId,
    }: {
        vehicleId: string,
    }): CancelablePromise<PartFailurePredictionDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ai/vehicle/health/vehicles/{vehicleId}/predictions',
            path: { 'vehicleId': vehicleId },
        });
    }

    public static acknowledgeVehicleHealthPrediction({
        predictionId,
    }: {
        predictionId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/ai/vehicle/health/predictions/{predictionId}/acknowledge',
            path: { 'predictionId': predictionId },
        });
    }
}

