/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { ChangePasswordDto } from '../models/ChangePasswordDto';
import type { ProfileDtoResponseDto } from '../models/ProfileDtoResponseDto';
import type { RoleDtoResponseDto } from '../models/RoleDtoResponseDto';
import type { UpdateProfileDto } from '../models/UpdateProfileDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * GetProfile
     * Retrieve the logged in user's profile details.
     * @returns ProfileDtoResponseDto OK
     * @throws ApiError
     */
    public static getProfile(): CancelablePromise<ProfileDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/profile',
        });
    }
    /**
     * UpdateProfile
     * Update the logged in user's profile details.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static updateProfile({
        requestBody,
    }: {
        requestBody?: UpdateProfileDto,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/profile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetAssignedRole
     * Retrieve the logged in user's assigned role.
     * @returns RoleDtoResponseDto OK
     * @throws ApiError
     */
    public static getAssignedRole(): CancelablePromise<RoleDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/profile/assigned/role',
        });
    }
    /**
     * UpdateProfileImage
     * Update the logged in user's profile image.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static updateProfileImage({
        formData,
    }: {
        formData?: {
            ProfileImage: Blob;
        },
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/profile/image',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * RemoveProfileImage
     * Remove the logged in user's profile image.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static removeProfileImage(): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/profile/image',
        });
    }
    /**
     * ChangePassword
     * Change the logged in user's password.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static changePassword({
        requestBody,
    }: {
        requestBody?: ChangePasswordDto,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/profile/change/password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
