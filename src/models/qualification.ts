import { Schema, model, Types, Document } from "mongoose";

const QualificationSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    degree: {
        type: String,
        enum: ["High School", "National Diploma", "Higher National Diploma", "Bachelor", "Masters", "PhD", "Other"],
        required: true
    },
    fieldOfExpertise: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        default: ''
    },
    year: {
        type: Number,
        required: true
    },
    experienceYears: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export interface IQualification extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    degree: "High School"| "National Diploma"| "Higher National Diploma"| "Bachelor" | "Masters" | "PhD" | "Other";
    fieldOfExpertise: string;
    institution?: string;
    year: number;
    experienceYears?: number;
}

export const Qualification = model<IQualification>("Qualification", QualificationSchema)