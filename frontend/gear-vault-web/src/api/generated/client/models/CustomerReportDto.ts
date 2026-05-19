/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from './UserDto';
export type CustomerReportDto = {
    customer?: UserDto;
    vehicleCount?: number;
    invoiceCount?: number;
    totalSpent?: number;
    pendingCredit?: number;
    lastPurchaseAt?: string | null;
};

