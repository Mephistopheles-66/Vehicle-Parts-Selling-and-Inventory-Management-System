/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartDto } from './PartDto';
import type { VehicleDto } from './VehicleDto';
export type PartFailurePredictionDto = {
    id?: string;
    vehicle?: VehicleDto;
    part?: PartDto | null;
    predictedPartName?: string | null;
    conditionSummary?: string | null;
    usagePatternSummary?: string | null;
    riskScore?: number;
    severity?: string | null;
    predictedFailureDate?: string | null;
    recommendation?: string | null;
    generatedAt?: string;
    isAcknowledged?: boolean;
    acknowledgedAt?: string | null;
};

