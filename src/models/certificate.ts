import { Schema, Document, model, Types } from "mongoose";
import { Institution, IInstitution } from "./institution";
import { IUser, User } from "./user";

const CertificateSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  course: {
    type: String,
    default: null,
  },
  degree: {
    type: String,
    default: null,
  },
  year: {
    type: String,
    default: null,
  },
  honors: {
    type: String,
    default: null,
  },
  institution: {
    type: Types.ObjectId,
    ref: "Institution",
    required: true,
    index: true
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
  user: Types.ObjectId | IUser;
  course?: string;
  degree?: string;
  year?: string;
  honors?: string;
  institution: Types.ObjectId | IInstitution;
  deleted?: boolean;
}

export const Certificate = model<ICertificate>("Certificate", CertificateSchema);
