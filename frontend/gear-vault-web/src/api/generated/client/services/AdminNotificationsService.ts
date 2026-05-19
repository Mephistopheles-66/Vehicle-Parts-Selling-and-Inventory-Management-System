/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminNotificationDtoListResponseDto } from '../models/AdminNotificationDtoListResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminNotificationsService {
    /**
     * GetLowStockNotifications
     * Retrieve low-stock admin notifications.
     * @returns AdminNotificationDtoListResponseDto OK
     * @throws ApiError
     */
    public static getLowStockNotifications(): CancelablePromise<AdminNotificationDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/notifications/low-stock',
        });
    }
}
