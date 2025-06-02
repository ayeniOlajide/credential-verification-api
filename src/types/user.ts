import { Types } from "mongoose";
import { IUser } from "../models/user";
import { IRole } from "../models/role";

export type UserId = string | Types.ObjectId;

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUserRegistration extends IUserLogin {
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: Types.ObjectId | IRole;
}

export interface IUserUpdate {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isBanned?: boolean;
    emailVerified?: boolean;
    lastSeen?: Date;
}

export interface IUserFind {
    userId?: string | Types.ObjectId;
    email?:string;
    username?: string;
    longOtpCode?: string;
}

export interface IUserSearch {
    searchFilter: { isAdmin?: boolean, isBanned?: boolean, accountType?: string, }
    searchText: string;
    type?: string;
}

export interface IUsers {
    users: IUser[] | null;
    count: number;
}