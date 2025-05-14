import { Schema, Document, model, Types } from "mongoose";
import { ICertificate } from "./certificate";
import { IUser } from "./user";

const DownloadLogSchema = new Schema({
    certificateId: {
      type: Types.ObjectId,
      ref: "Certificate",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloadedAt: {
      type: Date,
      default: Date.now,
    },
  }, {
    timestamps: true,
  });
  
  export interface IDownloadLog extends Document {
    _id: Types.ObjectId;
    certificateId: Types.ObjectId | ICertificate;
    user: Types.ObjectId | IUser;
    downloadedAt: Date;
  }
  
  export const DownloadLog = model<IDownloadLog>("DownloadLog", DownloadLogSchema);
  