import { Schema, model, Types, Document } from "mongoose";

const CountrySchema = new Schema({
    countryName: {
        type: String,
        required: true,
    },
    countryAbbreviation: {
        type: String,
        required: true,
    },
    countryCode: {
        type: String,
    },
    deleted: {
        type: Boolean,
        default: false,
    }
})

export interface ICountry extends Document {
    _id: Types.ObjectId;
    countryName: string;
    countryAbbreviation?: string;
    countryCode?: string;
}

export const Country = model<ICountry>("Country", CountrySchema)