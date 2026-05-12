/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
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
}
