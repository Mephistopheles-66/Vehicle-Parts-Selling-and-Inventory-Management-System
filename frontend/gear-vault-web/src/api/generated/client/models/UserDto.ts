/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssetDto } from './AssetDto';
import type { RoleDto } from './RoleDto';
export type UserDto = {
    id?: string;
    isActive?: boolean;
    name?: string | null;
    emailAddress?: string | null;
    username?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    isVerified?: boolean;
    role?: RoleDto;
    profileImage?: AssetDto;
};

