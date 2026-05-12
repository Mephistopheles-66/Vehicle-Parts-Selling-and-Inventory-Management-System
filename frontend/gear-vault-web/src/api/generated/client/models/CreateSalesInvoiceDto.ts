/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSalesInvoiceItemDto } from './CreateSalesInvoiceItemDto';
import type { PaymentStatus } from './PaymentStatus';
export type CreateSalesInvoiceDto = {
    vehicleId?: string;
    paymentStatus?: PaymentStatus;
    remarks?: string | null;
    sendEmail?: boolean;
    items?: Array<CreateSalesInvoiceItemDto> | null;
};

