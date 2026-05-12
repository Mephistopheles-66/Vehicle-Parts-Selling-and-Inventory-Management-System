/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartDto } from './PartDto';
export type SalesInvoiceItemDto = {
    id?: string;
    isActive?: boolean;
    salesInvoiceId?: string;
    part?: PartDto;
    quantity?: number;
    unitPrice?: number;
    lineTotal?: number;
};

