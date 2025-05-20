
//Schema for Keeping Admininstrator Users
import { Schema, Document, model, Types } from "mongoose";
import { Country, ICountry } from "./country";

const AdminGroupSchema = new Schema({
  adminGroupName: {
    type: String,
    required: true
  },
  adminGroupAddress: {
    type: String,
    default: null,
  },
  adminType: {
    type: String,
    enum: ["partner", "super"],
    default: "partner"
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
  },
  siteUrl: {
    type: String,
    default: null,
  },
  allTimeDownloads: { 
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

export interface IAdminGroup extends Document {
  _id: Types.ObjectId;
  adminGroupName: string;
  adminGroupAddress?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: Types.ObjectId | ICountry;
  siteUrl?: string;
  deleted?: boolean;
  allTimeDownloads?: number;
  adminType?: string;
  
}

export const AdminGroup = model<IAdminGroup>("AdminGroup", AdminGroupSchema);
