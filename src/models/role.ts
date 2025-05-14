import { Schema, Document, model, Types } from "mongoose";

const RoleSchema = new Schema ({
    roleName: {
        type: String,
        required: true,
    },
    roleAbbreviation: {
        type: String,
        default: null,
    },
    privileges: {
        type: [String],
        default: null
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

export interface IRole extends Document {
    _id: Types.ObjectId;
    roleName: string;
    roleAbbreviation?: string;
    privileges: string[];
    deleted: boolean;
} 

export const Role = model<IRole>("Role", RoleSchema);