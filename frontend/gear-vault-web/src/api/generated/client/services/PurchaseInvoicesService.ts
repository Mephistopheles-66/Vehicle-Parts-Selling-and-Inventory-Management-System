/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePurchaseInvoiceDto } from '../models/CreatePurchaseInvoiceDto';
import type { PurchaseInvoiceDtoListResponseDto } from '../models/PurchaseInvoiceDtoListResponseDto';
import type { PurchaseInvoiceDtoResponseDto } from '../models/PurchaseInvoiceDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PurchaseInvoicesService {
    /**
     * GetAllPurchaseInvoices
     * Retrieve all purchase invoices.
     * @returns PurchaseInvoiceDtoListResponseDto OK
     * @throws ApiError
     */
    public static getAllPurchaseInvoices(): CancelablePromise<PurchaseInvoiceDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/purchase-invoices',
        });
    }
    /**
     * CreatePurchaseInvoice
     * Create a new purchase invoice.
     * @returns PurchaseInvoiceDtoResponseDto OK
     * @throws ApiError
     */
    public static createPurchaseInvoice({
        requestBody,
    }: {
        requestBody?: CreatePurchaseInvoiceDto,
    }): CancelablePromise<PurchaseInvoiceDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/purchase-invoices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetPurchaseInvoiceById
     * Retrieve a purchase invoice by identifier.
     * @returns PurchaseInvoiceDtoResponseDto OK
     * @throws ApiError
     */
    public static getPurchaseInvoiceById({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<PurchaseInvoiceDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/purchase-invoices/{invoiceId}',
            path: {
                'invoiceId': invoiceId,
            },
        });
    }
    /**
     * PostPurchaseInvoice
     * Post a draft purchase invoice and update stock.
     * @returns PurchaseInvoiceDtoResponseDto OK
     * @throws ApiError
     */
    public static postPurchaseInvoice({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<PurchaseInvoiceDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/purchase-invoices/{invoiceId}/post',
            path: {
                'invoiceId': invoiceId,
            },
        });
    }
    /**
     * CancelPurchaseInvoice
     * Cancel a purchase invoice and reverse stock if posted.
     * @returns PurchaseInvoiceDtoResponseDto OK
     * @throws ApiError
     */
    public static cancelPurchaseInvoice({
        invoiceId,
    }: {
        invoiceId: string,
    }): CancelablePromise<PurchaseInvoiceDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/purchase-invoices/{invoiceId}/cancel',
            path: {
                'invoiceId': invoiceId,
            },
        });
    }
}
