import { Types } from "mongoose";
import { IUser } from "../models/user";
import { IRole } from "../models/role";
import { IQualification } from "../models/qualification";

export type UserId = string | Types.ObjectId;

export interface IUserLogin {
    email?: string;
    username?: string;
    password: string;
}

export interface IUserRegistration {
    email: string;
    password: string;
}

export interface IUserCreate extends IUserLogin {
}

export interface IUserProfileUpdate {
    firstName: string;
    lastName: string;
    role: Types.ObjectId | IRole;  //User role e.g candidate or recruiter
    qualifications?: Types.ObjectId | IQualification;   //Link to qualifications doc
    location?: string;
    dateOfBirth: Date;  //used to filter by age range
    phone: string;
    accountType?: string;
    gender?: "male" | "female" | "other";
    organizationName?: string;

}

export interface IUserUpdate {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    qualifications?: Types.ObjectId | IQualification;
    location?: string;
    dateOfBirth?: Date;  //used to filter by age range
    bio?: string;
    phone?: string;
    isBanned?: boolean;
    emailVerified?: boolean;
    lastSeen?: Date;
    accountType?: string;
}

export interface IUserFind {
    userId?: string | Types.ObjectId;
    email?: string;
    username?: string;
    longOtpCode?: string;
}

export interface IUserSearch {
    searchText: string;         //keyword being searched for
    type?: string;              //filter type


    filters?: {                 //strict filters to apply before fuzzy search
        isAdmin?: boolean;
        isBanned?: boolean;
        accountType?: 'candidate' | 'recruiter';
    };

}

export interface IUsers {
    users: IUser[] | null;
    count: number;
}