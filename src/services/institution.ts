import { Types } from "mongoose";
import { Institution, IInstitution } from "../models/institution";
import Fuse from 'fuse.js';

export type ADMIN_GROUP_CREATION_DETAILS = Pick<
  IInstitution,
  "institutionName" | "institutionAddress" | "phone" | "email" | "state" | "city" | "siteUrl" | "testApiKey" | "productionApiKey" | "queryCommission" | "downloadCommission" | "balance" | "allTimeRevenue" | "partnerAllTimeRevenue" |"commissionBased" | "platformAllTimeRevenue" | "allTimeQuery" | "allTimeDownloads"
>;

interface IInstitutionFind {
  institutionId?: string | Types.ObjectId;
  institutionName?: string;
}

export interface IInstitutions {
  institutions: IInstitution[] | null;
  count: number;
}

export interface IInstitutionSearch {
  searchFilter: { deleted?: boolean }
  searchText: string;
}


export type InstitutionId = string | Types.ObjectId;

interface IInstitutionFilter {
  adminGroup?: InstitutionId
}

export const getInstitution = async (institutionData: { institutionId?: InstitutionId, institutionName?: string }): Promise<IInstitution | null> => {
  try {
    let institution;
    if (institutionData.hasOwnProperty("institutionId")) {
      institution = await Institution.findOne({ _id: institutionData.institutionId });
      if (institution) return institution;
    }
    if (institutionData.hasOwnProperty("institutionName")) {
      institution = await Institution.findOne({
        institutionName: institutionData.institutionName,
      });
      if (institution) return institution;
    }
    return null;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const createInstitution = async (institutionData: ADMIN_GROUP_CREATION_DETAILS): Promise<IInstitution | null> => {
  try {
    const institution = new Institution({ ...institutionData });
    const isSaved = await institution.save();
    if (!isSaved) throw new Error("Institution could not be created, contact support");
    return isSaved;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateInstitution = async (institutionId: InstitutionId, institutionData: ADMIN_GROUP_CREATION_DETAILS | IInstitutionUpdateBalance): Promise<boolean> => {
  try {
    const isUpdated = await Institution.findOneAndUpdate({ _id: institutionId }, institutionData);
    if (!isUpdated) throw new Error("Institution could not be updated, contact support");
    return true
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteInstitution = async (institutionData: { institutionId?: InstitutionId }): Promise<boolean> => {
  try {
    const institution = await Institution.findOne({
      _id: institutionData.institutionId,
    });
    if (!institution) throw new Error("Institution could not found");
    //update the deleted field only
    institution.deleted = true;
    const isUpdated = await Institution.findOneAndUpdate(
      { _id: institutionData.institutionId },
      institution
    );
    if (!isUpdated) throw new Error("Institution could not be deleted, contact support");
    return true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const getInstitutions = async (pagination?: Pagination, filter?: ADMIN_GROUP_CREATION_DETAILS): Promise<IInstitutions> => {
  try {
    let institutions: IInstitution[] = [];
    let count = 0;
    const pageOptions = {
      page: pagination?.from || 0,
      limit: pagination?.limit || 20,
      sort: pagination?.orderBy || "createdAt",
      direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
    }

    institutions = await Institution.find({ ...filter })
      .sort([[pageOptions.sort, pageOptions.direction]])
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();
    count = await Institution.find({ ...filter }).countDocuments();
    return { institutions, count };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getAllInstitutions = async (filter: IInstitutionFilter): Promise<Array<IInstitution>> => {
  try {
    let institutions: IInstitution[] = [];
    institutions = await Institution.find(filter)
    return institutions;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const searchInstitution = async (searchData: IInstitutionSearch): Promise<Array<IInstitution> | null> => {
  try {
    let response;
    const searchText = searchData.searchText;
    const institutions = await Institution.find({ ...searchData.searchFilter });
    let fuse = new Fuse(institutions, {
      keys: ["institutionName", "email"],
      findAllMatches: false,
      threshold: 0.3,
    });

    let results;
    results = fuse.search({
      $or: [
        { institutionName: searchText },
        { email: searchText },
      ],
    });
    response = results.map((res: any) => res.item);
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}