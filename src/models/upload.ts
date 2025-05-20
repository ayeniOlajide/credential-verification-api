import { Schema, Document, model, Types } from "mongoose"
import { Institution } from "./institution"
import { User, IUser } from "./user"

const UploadLogSchema = new Schema({
    uploadCount: {
        type: Number,
        required: true,
    },
    Institution: {
        type: Types.ObjectId,
        ref: "Institution",
        default: null,
    },
    user: {
        type: Types.ObjectId,
        ref: "User",
        default: null,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

export interface IUploadLog extends Document {
    _id: Types.ObjectId;
    institution?: string | Types.ObjectId;
    user?: string | Types.ObjectId;
    uploadCount: number;
    deleted: boolean;
}

export const UploadLog = model<IUploadLog>("UploadLog", UploadLogSchema)