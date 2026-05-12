/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePurchaseInvoiceLineItemDto } from './CreatePurchaseInvoiceLineItemDto';
export type CreatePurchaseInvoiceDto = {
    vendorId?: string;
    invoiceNo?: string | null;
    invoiceDate?: string;
    dueDate?: string | null;
    lineItems?: Array<CreatePurchaseInvoiceLineItemDto> | null;
    discount?: number;
    taxAmount?: number;
    amountPaid?: number;
};

