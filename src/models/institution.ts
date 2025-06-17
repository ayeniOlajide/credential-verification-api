import { Schema, Document, model, Types } from "mongoose";
import { Country, ICountry } from "./country";

const InstitutionSchema = new Schema({
    institutionName: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["university", "polytechnic", "training-centre"],
        default: "university"
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
    state?: string;
    country: Types.ObjectId | ICountry;
    deleted?: boolean;
}

export const Institution = model<IInstitution>("Institution", InstitutionSchema)