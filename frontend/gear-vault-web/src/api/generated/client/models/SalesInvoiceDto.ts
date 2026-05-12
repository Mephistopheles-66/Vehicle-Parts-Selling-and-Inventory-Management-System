/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentStatus } from './PaymentStatus';
import type { SalesInvoiceItemDto } from './SalesInvoiceItemDto';
import type { UserDto } from './UserDto';
import type { VehicleDto } from './VehicleDto';
export type SalesInvoiceDto = {
    id?: string;
    isActive?: boolean;
    invoiceNumber?: string | null;
    customer?: UserDto;
    vehicle?: VehicleDto;
    staff?: UserDto;
    subTotal?: number;
    discountAmount?: number;
    totalAmount?: number;
    paymentStatus?: PaymentStatus;
    remarks?: string | null;
    createdAt?: string;
    paidAt?: string | null;
    emailSent?: boolean;
    emailSentAt?: string | null;
    items?: Array<SalesInvoiceItemDto> | null;
};

