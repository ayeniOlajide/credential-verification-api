import { Schema, Document, model, Types } from "mongoose";
import { Country, ICountry } from "./country";

const InstitutionSchema = new Schema({
    institutionName: {
        type: String,
        default: null,
        required: true,
    },
    institutionAddress: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    city: {
        type: String,
        default: null,
    },
    state: {
        type: String,
        default: null,
    },
    country: {
        type: Types.ObjectId,
        ref: "Country",
        default: null,
    },
    siteUrl: {
        type: String,
        default: null,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

export interface IInstitution extends Document {
    _id: Types.ObjectId;
    institutionName: string;
    institutionAddress?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    country: Types.ObjectId | ICountry;
    siteUrl?: string;
    deleted?: boolean;
}

export const Institution = model<IInstitution>("Institution", InstitutionSchema)