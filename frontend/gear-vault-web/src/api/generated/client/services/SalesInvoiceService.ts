/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CreateSalesInvoiceDto } from '../models/CreateSalesInvoiceDto';
import type { GuidResponseDto } from '../models/GuidResponseDto';
import type { SalesInvoiceDtoCollectionDto } from '../models/SalesInvoiceDtoCollectionDto';
import type { SalesInvoiceDtoResponseDto } from '../models/SalesInvoiceDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SalesInvoiceService {
    /**
     * GetAllInvoices
     * Retrieve all sales invoices with pagination.
     * @returns SalesInvoiceDtoCollectionDto OK
     * @throws ApiError
     */
    public static getAllInvoices({
        pageNumber,
        pageSize,
        globalSearch,
        isActive,
        orderBys,
        userId,
    }: {
        pageNumber?: number,
        pageSize?: number,
        globalSearch?: string,
        isActive?: Array<boolean>,
        orderBys?: Array<string>,
        userId?: string,
    }): CancelablePromise<SalesInvoiceDtoCollectionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/sales/invoice',
            query: {
                'PageNumber': pageNumber,
                'PageSize': pageSize,
                'GlobalSearch': globalSearch,
                'IsActive': isActive,
                'OrderBys': orderBys,
                'userId': userId,
            },
        });
    }
    /**
     * CreateInvoice
     * Create a new sales invoice. Applies 10% loyalty discount when subtotal exceeds 5000.
     * @returns GuidResponseDto OK
     * @throws ApiError
     */
    public static createInvoice({
        requestBody,
    }: {
        requestBody?: CreateSalesInvoiceDto,
    }): CancelablePromise<GuidResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sales/invoice',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetInvoiceById
     * Retrieve sales invoice details by identifier.
     * @returns SalesInvoiceDtoResponseDto OK
     * @throws ApiError
     */
    public static getInvoiceById({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<SalesInvoiceDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/sales/invoice/{invoiceId}',
            path: {
                'invoiceId': invoiceId,
            },
        });
    }
    /**
     * SendInvoiceEmail
     * Re-send the invoice email to the customer.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static sendInvoiceEmail({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sales/invoice/{invoiceId}/send-email',
            path: {
                'invoiceId': invoiceId,
            },
        });
    }
}
