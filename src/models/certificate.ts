import { Schema, Document, model, Types } from "mongoose";
import { Institution, IInstitution } from "./institution";

const CertificateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    default: null,
  },
  course: {
    type: String,
    default: null,
  },
  degree: {
    type: String,
    default: null,
  },
  page: {
    type: Number,
    default: null,
  },
  year: {
    type: String,
    default: null,
  },
  affiliatedInstitution: {
    type: String,
    default: null,
  },
  batch: {
    type: Object,
    default: null,
  },
  institution: {
    type: Types.ObjectId,
    ref: "Institution",
    required: true
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
}
);

export interface ICertificate extends Document {
  _id: Types.ObjectId;
  name: string;
  faculty?: string;
  department?: string;
  course?: string;
  degree?: string;
  page?: string;
  year?: string;
  affiliatedInstitution?: string;
  institution: Types.ObjectId | IInstitution;
  batch: Types.ObjectId,
  deleted?: boolean;
}

export const Certificate = model<ICertificate>("Certificate", CertificateSchema);
