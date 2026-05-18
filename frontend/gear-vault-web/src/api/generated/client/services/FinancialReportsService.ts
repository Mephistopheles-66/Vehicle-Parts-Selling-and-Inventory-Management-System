import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type FinancialReportEntryDto = {
    period?: string | null;
    totalSalesRevenue?: number;
    totalPurchaseCost?: number;
    totalProfit?: number;
    totalDiscounts?: number;
    totalTax?: number;
    salesInvoiceCount?: number;
    purchaseInvoiceCount?: number;
};

export type FinancialReportDto = {
    reportType?: string | null;
    fromDate?: string;
    toDate?: string;
    totalSalesRevenue?: number;
    totalPurchaseCost?: number;
    totalProfit?: number;
    totalDiscounts?: number;
    totalTax?: number;
    totalSalesInvoices?: number;
    totalPurchaseInvoices?: number;
    entries?: Array<FinancialReportEntryDto> | null;
};

export type FinancialReportDtoResponseDto = {
    statusCode?: number;
    message?: string | null;
    result?: FinancialReportDto;
};

export class FinancialReportsService {
    /**
     * GetFinancialReport
     * Generate a financial report for the specified period (daily, monthly, yearly).
     * @returns FinancialReportDtoResponseDto OK
     * @throws ApiError
     */
    public static getFinancialReport({
        period,
        from,
        to,
    }: {
        period: string,
        from?: string,
        to?: string,
    }): CancelablePromise<FinancialReportDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/financial-reports',
            query: {
                'Period': period,
                'From': from,
                'To': to,
            },
        });
    }
}
