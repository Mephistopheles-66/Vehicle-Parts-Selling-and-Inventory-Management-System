/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentDtoListResponseDto } from '../models/AppointmentDtoListResponseDto';
import type { AppointmentDtoResponseDto } from '../models/AppointmentDtoResponseDto';
import type { CreateAppointmentDto } from '../models/CreateAppointmentDto';
import type { RescheduleAppointmentDto } from '../models/RescheduleAppointmentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppointmentsService {
    /**
     * GetAllAppointments
     * Retrieve all appointments. Staff and admin only.
     * @returns AppointmentDtoListResponseDto OK
     * @throws ApiError
     */
    public static getAllAppointments(): CancelablePromise<AppointmentDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/appointments/all',
        });
    }

    /**
     * GetMyAppointments
     * Retrieve all appointments for the current user.
     * @returns AppointmentDtoListResponseDto OK
     * @throws ApiError
     */
    public static getMyAppointments(): CancelablePromise<AppointmentDtoListResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/appointments',
        });
    }
    /**
     * CreateAppointment
     * Create a new appointment for a vehicle owned by the current user.
     * @returns AppointmentDtoResponseDto OK
     * @throws ApiError
     */
    public static createAppointment({
        requestBody,
    }: {
        requestBody?: CreateAppointmentDto,
    }): CancelablePromise<AppointmentDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/appointments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * GetAppointmentById
     * Retrieve an appointment by identifier.
     * @returns AppointmentDtoResponseDto OK
     * @throws ApiError
     */
    public static getAppointmentById({
        appointmentId,
    }: {
        appointmentId: string,
    }): CancelablePromise<AppointmentDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/appointments/{appointmentId}',
            path: {
                'appointmentId': appointmentId,
            },
        });
    }
    /**
     * RescheduleAppointment
     * Reschedule a pending appointment.
     * @returns AppointmentDtoResponseDto OK
     * @throws ApiError
     */
    public static rescheduleAppointment({
        appointmentId,
        requestBody,
    }: {
        appointmentId: string,
        requestBody?: RescheduleAppointmentDto,
    }): CancelablePromise<AppointmentDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/appointments/{appointmentId}/reschedule',
            path: {
                'appointmentId': appointmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * CancelAppointment
     * Cancel a pending appointment.
     * @returns AppointmentDtoResponseDto OK
     * @throws ApiError
     */
    public static cancelAppointment({
        appointmentId,
    }: {
        appointmentId: string,
    }): CancelablePromise<AppointmentDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/appointments/{appointmentId}/cancel',
            path: {
                'appointmentId': appointmentId,
            },
        });
    }

    /**
     * CreateAppointmentByStaff
     * Create an appointment for any customer vehicle. Staff and admin only.
     * @returns AppointmentDtoResponseDto OK
     * @throws ApiError
     */
    public static createAppointmentByStaff({
        requestBody,
    }: {
        requestBody?: CreateAppointmentDto,
    }): CancelablePromise<AppointmentDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/appointments/staff',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * CompleteAppointment
     * Mark an appointment as completed. Staff and admin only.
     * @returns AppointmentDtoResponseDto OK
     * @throws ApiError
     */
    public static completeAppointment({
        appointmentId,
    }: {
        appointmentId: string,
    }): CancelablePromise<AppointmentDtoResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/appointments/{appointmentId}/complete',
            path: {
                'appointmentId': appointmentId,
            },
        });
    }
}
