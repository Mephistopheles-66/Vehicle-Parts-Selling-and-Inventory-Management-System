/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseInvoiceLineItemDto } from './PurchaseInvoiceLineItemDto';
import type { VendorDto } from './VendorDto';
export type PurchaseInvoiceDto = {
    id?: string;
    vendor?: VendorDto;
    invoiceNo?: string | null;
    invoiceDate?: string;
    dueDate?: string | null;
    status?: string | null;
    lineItems?: Array<PurchaseInvoiceLineItemDto> | null;
    subtotal?: number;
    discount?: number;
    taxAmount?: number;
    grandTotal?: number;
    amountPaid?: number;
    balanceDue?: number;
    createdAt?: string;
    updatedAt?: string;
};

