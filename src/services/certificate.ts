import { Types, startSession } from "mongoose";
import { Certificate, ICertificate } from "../models/certificate";
import Fuse from 'fuse.js';
import { UploadLog, IUploadLog } from "../models/uploadlog";
import { parseExcelFile } from "../utils/parseExcelFile";

export type CERTIFICATE_CREATION_DETAILS = Pick<
  ICertificate,
  "name" | "faculty" | "department" | "course" | "degree" | "page" | "year" | "affliatedInstitution" | "key" | "institution"
>;

export type UPLOAD_LOG_DETAILS = Pick<
  IUploadLog,
  "institution" | "uploadCount" | "user"
>;

interface ICertificateFind {
  certificateId?: string | Types.ObjectId;
}

export interface ICertificates {
  certificates: ICertificate[] | null;
  count: number;
}

export interface IUploadLogs {
  logs: IUploadLog[] | null;
  count: number;
}

export interface ICertificateSearch {
  searchFilter: { deleted?: boolean };
  searchText: string;
}

export interface ICertificateFetch {
  institution: string | Types.ObjectId;
  country: string | Types.ObjectId;
  candidateName: string;
}

export type CertificateId = string | Types.ObjectId;
export type InstitutionId = string | Types.ObjectId;
export type UserId = string | Types.ObjectId;

export const getCertificate = async (certificateData: { certificateId?: CertificateId }): Promise<ICertificate | null> => {
  try {
    let certificate;
    if (certificateData.hasOwnProperty("certificateId")) {
      certificate = await Certificate.findOne({ _id: certificateData.certificateId });
      if (certificate) return certificate;
    }
    return null;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const createCertificate = async (certificateData: CERTIFICATE_CREATION_DETAILS): Promise<ICertificate | null> => {
  try {
    const certificate = new Certificate({ ...certificateData });
    const isSaved = await certificate.save();
    if (!isSaved) throw new Error("Certificate could not be created, contact support");
    return isSaved;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateCertificate = async (certificateId: CertificateId, certificateData: CERTIFICATE_CREATION_DETAILS): Promise<boolean> => {
  try {
    const isUpdated = await Certificate.findOneAndUpdate({ _id: certificateId }, certificateData);
    if (!isUpdated) throw new Error("Certificate could not be updated, contact support");
    return true
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteCertificate = async (certificateData: { certificateId?: CertificateId }): Promise<boolean> => {
  try {
    const certificate = await Certificate.findOne({
      _id: certificateData.certificateId,
    });
    if (!certificate) throw new Error("Certificate could not found");
    //update the deleted field only
    certificate.deleted = true;
    const isUpdated = await Certificate.findOneAndUpdate(
      { _id: certificateData.certificateId },
      certificate
    );
    if (!isUpdated) throw new Error("Certificate could not be deleted, contact support");
    return true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const getCertificates = async (pagination?: Pagination, filter?: CERTIFICATE_CREATION_DETAILS): Promise<ICertificates> => {
  try {
    let certificates: ICertificate[] = [];
    let count = 0;
    const pageOptions = {
      page: pagination?.from || 0,
      limit: pagination?.limit || 20,
      sort: pagination?.orderBy || "createdAt",
      direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
    }

    certificates = await Certificate.find({ ...filter }).populate("institution")
      .sort([[pageOptions.sort, pageOptions.direction]])
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();
    count = await Certificate.find({ ...filter }).countDocuments();
    return { certificates, count };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getUploadBatches = async (pagination?: Pagination, filter?: UPLOAD_LOG_DETAILS): Promise<IUploadLogs> => {
  try {
    let count = 0;
    const pageOptions = {
      page: pagination?.from || 0,
      limit: pagination?.limit || 20,
      sort: pagination?.orderBy || "createdAt",
      direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
    }

    const logs = await UploadLog.find({ ...filter }).populate("institution")
      .sort([[pageOptions.sort, pageOptions.direction]])
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();

    count = await UploadLog.find({ ...filter }).countDocuments();
    return { logs, count };

  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const searchCertificate = async (searchData: ICertificateSearch): Promise<Array<ICertificate> | null> => {
  try {
    let response;
    const searchText = searchData.searchText;
    console.log(searchData.searchFilter);
    const certificates = await Certificate.find({ ...searchData.searchFilter });
    let fuse = new Fuse(certificates, {
      keys: ["name"],
      findAllMatches: false,
      threshold: 0.3,
    });

    let results;
    results = fuse.search({
      $or: [
        { name: searchText }
      ],
    });
    response = results.map((res: any) => res.item);
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const fetchCertificate = async (searchData: ICertificateFetch): Promise<Array<ICertificate> | null> => {
  try {
    let response;
    const searchText = searchData.candidateName;

    console.log(searchData);
    const certificates = await Certificate.aggregate([
      {
        $match: {
          institution: new Types.ObjectId(searchData.institution),
          deleted: false, 
          active: true
        }
      },
      {
        $lookup: {
          from: "institutions",
          localField: "institution",
          foreignField: "_id",
          as: "institutionData",
        },
      },
      {
        $unwind: "$institutionData",
      },
      {
        $match: {
          "institutionData.country": new Types.ObjectId(searchData.country),
        },
      },
      {
        $project: {
          name: 1,
          faculty: 1,
          department: 1,
          course: 1,
          degree: 1,
          page: 1,
          year: 1,
          key: 1,
          affliatedInstitution: 1,
          institution: "$institutionData._id", 
          institutionName: "$institutionData.institutionName",
          country: "$institutionData.country",
          deleted: 1,
          active: 1,
        },
      },
    ]);

    console.log(certificates);

    let fuse = new Fuse(certificates, {
      keys: ["name"],
      findAllMatches: false,
      threshold: 0.3,
    });

    let results;
    results = fuse.search({
      $or: [
        { name: searchText }
      ],
    });
    response = results.map((res: any) => res.item);
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const uploadCertificates = async (filePath:any, institution: InstitutionId, user: UserId ): Promise<boolean> => {
  //const session = await startSession();
  //session.startTransaction();
  try {
    const batchSize = 1000; //uploading certificates 1000 per batches
    const uploadLog = new UploadLog({ user, institution, uploadCount: 0 });
    const isSavedBatch = await uploadLog.save();

    const certificatesData = parseExcelFile(filePath, institution, isSavedBatch._id);
    if (certificatesData.length === 0) {
      throw new Error("No certificate data found in file.");
    }

    let count = 0;
    for (let i = 0; i < certificatesData.length; i += batchSize) {
      const batch = certificatesData.slice(i, i + batchSize);
      count = count + batch.length;
      //insert batch certificates and update batch log
      await Certificate.insertMany(batch,);
      await UploadLog.findOneAndUpdate({ _id: isSavedBatch._id }, {uploadCount: count});
    }
     //await session.commitTransaction();
     return true;
 
   } catch (error) { 
     //await session.abortTransaction();
     throw new Error("Transaction aborted due to error:"+ (error as Error).message);
   } 
};
