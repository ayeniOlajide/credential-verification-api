import { Schema, model, Document, Types } from "mongoose";
import { Role, IRole } from "./role"

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
}

export const User = model<IUser>("User", UserSchema)