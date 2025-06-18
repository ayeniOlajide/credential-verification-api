import { Schema, model, Document, Types } from "mongoose";
import { Role, IRole } from "./role"
import { string } from "joi";
import { Qualification, IQualification } from "./qualification";


const UserSchema = new Schema ({
    username: {
        type: String,
        default: '',
    },
    firstName: {
        type: String,
        default: '',
    },
    lastName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
        index: true
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    accountType: {
        type: String,
        enum: ['candidate', 'recruiter'],
        default: 'candidate'
    },
    longOtpCode: {
        type: String,
        default: null,
    },
    longOtpExpiry: {
        type: Date,
        default: Date.now,
    },
    shortOtpCode: {
        type: String,
        default: null,
    },
    shortOtpExpiry: {
        type: Date,
        default: Date.now,
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: Types.ObjectId,
        ref: "Role",
        default:null,
    },
    emailVerified: {
        type: Boolean,
        default: 'false',
    },
    deleted: {
        type: Boolean,
        default: 'false',
    },
    qualifications: {
        type: Types.ObjectId,
        ref: "Qualification",
        index: true
    },
    lastSeen: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
})

export interface IUser extends Document {
    _id: Types.ObjectId;
    username?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role?: Types.ObjectId | IRole;
    password: string;
    phone?: string;
    dateOfBirth?: Date;
    bio?: string;
    isBanned?: boolean;
    accountType?: string;
    emailVerified: string;
    lastSeen?: string;
    deleted?: boolean;
    location?: string;
    isVerified?: boolean;
    longOtpCode?: string;
    longOtpExpiry: Date;
    qualifications?: Types.ObjectId | IQualification
    shortOtpCode?: string;
    shortOtpExpiry: Date;
}


export const User = model<IUser>("User", UserSchema)