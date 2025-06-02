import { Schema, model, Document, Types } from "mongoose";
import { Role, IRole } from "./role"
import { IInstitution, Institution } from "./institution";

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
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    institution: {
        type: Types.ObjectId,
        ref: "Institution",
        default: null,
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
    emailVerified: string;
    lastSeen?: string;
    deleted?: string;
    institution?: Types.ObjectId | IInstitution;
    longOtpCode?: string;
    longOtpExpiry: Date;
    pin?: string;
    shortOtpCode?: string;
    shortOtpExpiry: Date;
}
}

export const User = model<IUser>("User", UserSchema)