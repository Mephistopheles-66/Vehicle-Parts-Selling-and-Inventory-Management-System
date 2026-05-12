/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoleDtoCollectionDto } from '../models/RoleDtoCollectionDto';
import type { RoleDtoListResponseDto } from '../models/RoleDtoListResponseDto';
import type { RoleDtoResponseDto } from '../models/RoleDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoleService {
    /**
     * GetAllRoles
     * Retrieve all roles with pagination.
     * @returns RoleDtoCollectionDto OK
     * @throws ApiError
     */
    public static getAllRoles({
        pageNumber,
        pageSize,
        globalSearch,
        isActive,
        orderBys,
        name,
        description,
    }: {
        pageNumber?: number,
        pageSize?: number,
        globalSearch?: string,
        isActive?: Array<boolean>,
        orderBys?: Array<string>,
        name?: string,
        description?: string,
    }): CancelablePromise<RoleDtoCollectionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/role',
            query: {
                'PageNumber': pageNumber,
                'PageSize': pageSize,
                'GlobalSearch': globalSearch,
                'IsActive': isActive,
                'OrderBys': orderBys,
                'name': name,
                'description': description,
            },
        });
    }
    /**
     * GetAllRolesList
     * Retrieve all roles without pagination.
     * @returns RoleDtoListResponseDto OK
     * @throws ApiError
     */
    public static getAllRolesList({
        globalSearch,
        isActive,
        orderBys,
        name,
        description,
    }: {
        globalSearch?: string,
        isActive?: Array<boolean>,
        orderBys?: Array<string>,
        name?: string,
        description?: string,
    }): CancelablePromise<RoleDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/role/list',
            query: {
                'GlobalSearch': globalSearch,
                'IsActive': isActive,
                'OrderBys': orderBys,
                'name': name,
                'description': description,
            },
        });
    }
    /**
     * GetAllAvailableRoles
     * Retrieve all available roles with pagination.
     * @returns RoleDtoCollectionDto OK
     * @throws ApiError
     */
    public static getAllAvailableRoles({
        pageNumber,
        pageSize,
        globalSearch,
        isActive,
        orderBys,
        name,
        description,
    }: {
        pageNumber?: number,
        pageSize?: number,
        globalSearch?: string,
        isActive?: Array<boolean>,
        orderBys?: Array<string>,
        name?: string,
        description?: string,
    }): CancelablePromise<RoleDtoCollectionDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/role/available',
            query: {
                'PageNumber': pageNumber,
                'PageSize': pageSize,
                'GlobalSearch': globalSearch,
                'IsActive': isActive,
                'OrderBys': orderBys,
                'name': name,
                'description': description,
            },
        });
    }
    /**
     * GetAllAvailableRolesList
     * Retrieve all available roles without pagination.
     * @returns RoleDtoListResponseDto OK
     * @throws ApiError
     */
    public static getAllAvailableRolesList({
        globalSearch,
        isActive,
        orderBys,
        name,
        description,
    }: {
        globalSearch?: string,
        isActive?: Array<boolean>,
        orderBys?: Array<string>,
        name?: string,
        description?: string,
    }): CancelablePromise<RoleDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/role/available/list',
            query: {
                'GlobalSearch': globalSearch,
                'IsActive': isActive,
                'OrderBys': orderBys,
                'name': name,
                'description': description,
            },
        });
    }
    /**
     * GetRoleById
     * Retrieve role by identifier.
     * @returns RoleDtoResponseDto OK
     * @throws ApiError
     */
    public static getRoleById({
        roleId,
    }: {
        roleId: string,
    }): CancelablePromise<RoleDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/role/{roleId}',
            path: {
                'roleId': roleId,
            },
        });
    }
}
