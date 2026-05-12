/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountConfirmationDto } from '../models/AccountConfirmationDto';
import type { AccountVerificationDto } from '../models/AccountVerificationDto';
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { LoginDto } from '../models/LoginDto';
import type { LoginSpaDtoResponseDto } from '../models/LoginSpaDtoResponseDto';
import type { TokenDtoResponseDto } from '../models/TokenDtoResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Login
     * Login user and return access token details.
     * @returns TokenDtoResponseDto OK
     * @throws ApiError
     */
    public static login({
        requestBody,
    }: {
        requestBody?: LoginDto,
    }): CancelablePromise<TokenDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/authentication/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * LoginViaSpa
     * Login user via SPA and return SPA login details.
     * @returns LoginSpaDtoResponseDto OK
     * @throws ApiError
     */
    public static loginViaSpa({
        requestBody,
    }: {
        requestBody?: LoginDto,
    }): CancelablePromise<LoginSpaDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/authentication/login/spa',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Register
     * Register a new customer account.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static register({
        formData,
    }: {
        formData?: {
            Name?: string;
            Username?: string;
            EmailAddress?: string;
            Address?: string;
            Image?: Blob;
            Password?: string;
            PhoneNumber?: string;
        },
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/authentication/register',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * ConfirmAccount
     * Confirm registered account using confirmation details.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static confirmAccount({
        requestBody,
    }: {
        requestBody?: AccountConfirmationDto,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/authentication/confirm/account',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * VerifyAccount
     * Verify registered account using verification code.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static verifyAccount({
        requestBody,
    }: {
        requestBody?: AccountVerificationDto,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/authentication/verify/account',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Logout
     * Logout the currently logged in user.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static logout(): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/authentication/logout',
        });
    }
}
