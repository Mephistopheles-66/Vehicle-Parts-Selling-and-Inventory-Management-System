/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponseDto } from '../models/BooleanResponseDto';
import type { CreateReviewDto } from '../models/CreateReviewDto';
import type { ReviewDtoListResponseDto } from '../models/ReviewDtoListResponseDto';
import type { ReviewDtoResponseDto } from '../models/ReviewDtoResponseDto';
import type { UpdateReviewDto } from '../models/UpdateReviewDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReviewsService {
    /**
     * GetMyReviews
     * Retrieve all reviews submitted by the current user.
     * @returns ReviewDtoListResponseDto OK
     * @throws ApiError
     */
    public static getMyReviews(): CancelablePromise<ReviewDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reviews',
        });
    }
    /**
     * CreateReview
     * Submit a review for a completed appointment.
     * @returns ReviewDtoResponseDto OK
     * @throws ApiError
     */
    public static createReview({
        requestBody,
    }: {
        requestBody?: CreateReviewDto,
    }): CancelablePromise<ReviewDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/reviews',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetReviewById
     * Retrieve a review by identifier.
     * @returns ReviewDtoResponseDto OK
     * @throws ApiError
     */
    public static getReviewById({
        reviewId,
    }: {
        reviewId: string,
    }): CancelablePromise<ReviewDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reviews/{reviewId}',
            path: {
                'reviewId': reviewId,
            },
        });
    }
    /**
     * UpdateReview
     * Update an existing review.
     * @returns ReviewDtoResponseDto OK
     * @throws ApiError
     */
    public static updateReview({
        reviewId,
        requestBody,
    }: {
        reviewId: string,
        requestBody?: UpdateReviewDto,
    }): CancelablePromise<ReviewDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/reviews/{reviewId}',
            path: {
                'reviewId': reviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * DeleteReview
     * Delete a review.
     * @returns BooleanResponseDto OK
     * @throws ApiError
     */
    public static deleteReview({
        reviewId,
    }: {
        reviewId: string,
    }): CancelablePromise<BooleanResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/reviews/{reviewId}',
            path: {
                'reviewId': reviewId,
            },
        });
    }
}
