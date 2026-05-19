/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CustomerFullProfileDtoResponseDto } from '../models/CustomerFullProfileDtoResponseDto';
import type { CustomerReportDtoListResponseDto } from '../models/CustomerReportDtoListResponseDto';
import type { CustomerSearchResultDtoListResponseDto } from '../models/CustomerSearchResultDtoListResponseDto';
import type { GuidResponseDto } from '../models/GuidResponseDto';
import type { RegisterWalkInCustomerDto } from '../models/RegisterWalkInCustomerDto';
import type { UserDtoCollectionDto } from '../models/UserDtoCollectionDto';
import type { UserDtoListResponseDto } from '../models/UserDtoListResponseDto';
import type { UserDtoResponseDto } from '../models/UserDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * GetAllUsers
     * Retrieve all users with pagination.
     * @returns UserDtoCollectionDto OK
     * @throws ApiError
     */
    public static getAllUsers({
        pageNumber,
        pageSize,
        globalSearch,
        isActive,
        orderBys,
        name,
        username,
        emailAddress,
        address,
        phoneNumber,
        roleIds,
    }: {
        pageNumber?: number,
        pageSize?: number,
        globalSearch?: string,
        isActive?: Array<boolean>,
        orderBys?: Array<string>,
        name?: string,
        username?: string,
        emailAddress?: string,
        address?: string,
        phoneNumber?: string,
        roleIds?: Array<string>,
    }): CancelablePromise<UserDtoCollectionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user',
            query: {
                'PageNumber': pageNumber,
                'PageSize': pageSize,
                'GlobalSearch': globalSearch,
                'IsActive': isActive,
                'OrderBys': orderBys,
                'name': name,
                'username': username,
                'emailAddress': emailAddress,
                'address': address,
                'phoneNumber': phoneNumber,
                'roleIds': roleIds,
            },
        });
    }
    /**
     * RegisterUser
     * Register a new user by admin.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static registerUser({
        formData,
    }: {
        formData?: {
            Password?: string;
            ProfileImage?: Blob;
            RoleId?: string;
            Name?: string;
            Username?: string;
            EmailAddress?: string;
            Address?: string;
            PhoneNumber?: string;
        },
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/user',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * GetAllUsersList
     * Retrieve all users without pagination.
     * @returns UserDtoListResponseDto OK
     * @throws ApiError
     */
    public static getAllUsersList({
        globalSearch,
        isActive,
        orderBys,
        name,
        username,
        emailAddress,
        address,
        phoneNumber,
        roleIds,
    }: {
        globalSearch?: string,
        isActive?: Array<boolean>,
        orderBys?: Array<string>,
        name?: string,
        username?: string,
        emailAddress?: string,
        address?: string,
        phoneNumber?: string,
        roleIds?: Array<string>,
    }): CancelablePromise<UserDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/list',
            query: {
                'GlobalSearch': globalSearch,
                'IsActive': isActive,
                'OrderBys': orderBys,
                'name': name,
                'username': username,
                'emailAddress': emailAddress,
                'address': address,
                'phoneNumber': phoneNumber,
                'roleIds': roleIds,
            },
        });
    }
    /**
     * GetUserById
     * Retrieve user by identifier.
     * @returns UserDtoResponseDto OK
     * @throws ApiError
     */
    public static getUserById({
        userId,
    }: {
        userId: string,
    }): CancelablePromise<UserDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * UpdateUser
     * Update user details.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static updateUser({
        userId,
        formData,
    }: {
        userId: string,
        formData?: {
            Id?: string;
            ProfileImage?: Blob;
            RoleId?: string;
            Name?: string;
            Username?: string;
            EmailAddress?: string;
            Address?: string;
            PhoneNumber?: string;
        },
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/user/{userId}',
            path: {
                'userId': userId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * ActivateDeactivateUser
     * Activate or deactivate user.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static activateDeactivateUser({
        userId,
    }: {
        userId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/user/{userId}/activate-deactivate',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * SearchCustomers
     * Search customers by name, phone, email, ID, or vehicle number. Returns each customer with all of their vehicles. Staff-only.
     * @returns CustomerSearchResultDtoListResponseDto OK
     * @throws ApiError
     */
    public static searchCustomers({
        q,
        limit = 20,
    }: {
        q?: string,
        limit?: number,
    }): CancelablePromise<CustomerSearchResultDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/customers/search',
            query: {
                'q': q,
                'limit': limit,
            },
        });
    }
    /**
     * RegisterWalkInCustomer
     * Staff registers a walk-in customer along with their vehicles. Auto-generates username and password; emails the password to the customer.
     * @returns GuidResponseDto OK
     * @throws ApiError
     */
    public static registerWalkInCustomer({
        requestBody,
    }: {
        requestBody?: RegisterWalkInCustomerDto,
    }): CancelablePromise<GuidResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/user/customers/walk-in',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetCustomerFullProfile
     * Retrieve a customer's aggregated profile: their info, vehicles, recent invoices, and totals. Staff-only.
     * @returns CustomerFullProfileDtoResponseDto OK
     * @throws ApiError
     */
    public static getCustomerFullProfile({
        customerId,
        recentInvoiceLimit = 20,
    }: {
        customerId: string,
        recentInvoiceLimit?: number,
    }): CancelablePromise<CustomerFullProfileDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/customers/{customerId}/full-profile',
            path: {
                'customerId': customerId,
            },
            query: {
                'recentInvoiceLimit': recentInvoiceLimit,
            },
        });
    }
    /**
     * GetRegularCustomerReports
     * Retrieve regular customers ranked by purchase frequency.
     * @returns CustomerReportDtoListResponseDto OK
     * @throws ApiError
     */
    public static getRegularCustomerReports({
        limit = 20,
    }: {
        limit?: number,
    }): CancelablePromise<CustomerReportDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/customers/reports/regulars',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * GetHighSpenderReports
     * Retrieve customers ranked by lifetime spending.
     * @returns CustomerReportDtoListResponseDto OK
     * @throws ApiError
     */
    public static getHighSpenderReports({
        limit = 20,
    }: {
        limit?: number,
    }): CancelablePromise<CustomerReportDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/customers/reports/high-spenders',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * GetPendingCreditReports
     * Retrieve customers with pending credit balances.
     * @returns CustomerReportDtoListResponseDto OK
     * @throws ApiError
     */
    public static getPendingCreditReports({
        limit = 20,
    }: {
        limit?: number,
    }): CancelablePromise<CustomerReportDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/user/customers/reports/pending-credits',
            query: {
                'limit': limit,
            },
        });
    }
}
