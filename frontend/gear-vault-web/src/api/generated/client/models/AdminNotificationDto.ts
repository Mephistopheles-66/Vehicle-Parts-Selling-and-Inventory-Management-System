/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartDto } from './PartDto';
import type { SalesInvoiceDto } from './SalesInvoiceDto';
import type { UserDto } from './UserDto';
export type AdminNotificationDto = {
    id?: string;
    type?: string | null;
    title?: string | null;
    message?: string | null;
    partId?: string | null;
    userId?: string | null;
    salesInvoiceId?: string | null;
    isRead?: boolean;
    readAt?: string | null;
    createdAt?: string;
    part?: PartDto;
    user?: UserDto;
    salesInvoice?: SalesInvoiceDto;
};

