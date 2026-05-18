/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SalesInvoiceDto } from './SalesInvoiceDto';
import type { UserDto } from './UserDto';
import type { VehicleDto } from './VehicleDto';
export type CustomerFullProfileDto = {
    customer?: UserDto;
    vehicles?: Array<VehicleDto> | null;
    recentInvoices?: Array<SalesInvoiceDto> | null;
    totalInvoiceCount?: number;
    lifetimeSpend?: number;
    outstandingBalance?: number;
};

