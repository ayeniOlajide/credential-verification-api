import { Types } from "mongoose"
import { IAdminGroup, AdminGroup } from "../models/adminGroup"
import { IInstitution, Institution } from "../models/institution"
import Fuse from "fuse.js"

export type ADMIN_GROUP_CREATION_DETAILS = Pick<IAdminGroup, "adminGroupName" | "adminGroupAddress" | "adminType" | "phone" | "email" | "state" | "city" | "siteUrl">;

export interface IAdminGroupFind {
    adminGroupId?: string | Types.ObjectId;
    adminGroupName?: string;
}

export interface IAdminGroupSearch {
    searchFilter: { deleted?: boolean }
    searchText: string
}

export type AdminGroupId = string | Types.ObjectId | IAdminGroup;

export const getAdminGroup = async (adminGroupData: { adminGroupId?: AdminGroupId, adminGroupName?: string }): Promise<IAdminGroup | null> => {
    try {
        let adminGroup;
        if (adminGroupData.hasOwnProperty("adminGroupId")) {
            adminGroup = await AdminGroup.findOne({ _id: adminGroupData.adminGroupId })
            if (adminGroup) return adminGroup
        }
        if (adminGroupData.hasOwnProperty("adminGroupName")) {
            adminGroup = await AdminGroup.findOne({
                adminGroupName: adminGroupData.adminGroupName,
            })
            if (adminGroup) return adminGroup;
        }
        return null
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

export const getAdminGroupById = async (adminGroupId: AdminGroupId): Promise<IAdminGroup | null> => {
    try {
        return await AdminGroup.findOne({ _id: adminGroupId });

    } catch (error) {
        throw new Error((error as Error).message);
    }
};


export const createAdminGroup = async (adminGroupData: ADMIN_GROUP_CREATION_DETAILS): Promise<IAdminGroup> => {
    try {
        const adminGroup = new AdminGroup({ ...adminGroupData });
        const isSaved = await adminGroup.save();
        if (!isSaved) throw new Error("Admin group creation failed");
        return isSaved;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const updateAdminGroup = async (adminGroupId: AdminGroupId, adminGroupData: ADMIN_GROUP_CREATION_DETAILS): Promise<boolean> => {
    try {
        const isUpdated = await AdminGroup.findOneAndUpdate({ _id: adminGroupId }, adminGroupData);
        if (!isUpdated) throw new Error("Admin group could not be updated")
        return true
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

export const deleteAdminGroup = async (adminGroupData: { adminGroupId?: AdminGroupId }): Promise<boolean> => {
    try {
      const adminGroup = await AdminGroup.findOne({
        _id: adminGroupData.adminGroupId,
      });
      if (!adminGroup) throw new Error("Organization could not found");
      //update the deleted field only
      adminGroup.deleted = true;
      const isUpdated = await AdminGroup.findOneAndUpdate(
        { _id: adminGroupData.adminGroupId },
        adminGroup
      );
      if (!isUpdated) throw new Error("Organization could not be deleted, contact support");
      return true;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  
  export const getAdminGroups = async (pagination?: Pagination, filter?: ADMIN_GROUP_CREATION_DETAILS): Promise<IAdminGroups> => {
    try {
      let adminGroups: IAdminGroup[] = [];
      let count = 0;
      const pageOptions = {
        page: pagination?.from || 0,
        limit: pagination?.limit || 20,
        sort: pagination?.orderBy || "createdAt",
        direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
      }
  
      adminGroups = await AdminGroup.find({ ...filter })
        .sort([[pageOptions.sort, pageOptions.direction]])
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec();
      count = await AdminGroup.find({ ...filter }).countDocuments();
      return { adminGroups, count };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  
  export const getAllAdminGroups = async (): Promise<Array<IAdminGroup>> => {
    try {
      let adminGroups: IAdminGroup[] = [];
      adminGroups = await AdminGroup.find({});
      return adminGroups;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
  
  export const searchAdminGroup = async (searchData: IAdminGroupSearch): Promise<Array<IAdminGroup> | null> => {
    try {
      let response;
      const searchText = searchData.searchText;
      const adminGroups = await AdminGroup.find({ ...searchData.searchFilter });
      let fuse = new Fuse(adminGroups, {
        keys: ["adminGroupName", "email"],
        findAllMatches: false,
        threshold: 0.3,
      });
  
      let results;
      results = fuse.search({
        $or: [
          { adminGroupName: searchText },
          { email: searchText },
        ],
      });
      response = results.map((res: any) => res.item);
      return response;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  
  export const getAdminGroupReferralCount = async (adminGroupId: AdminGroupId): Promise<Number> => {
    try {
      return await Institution.findOne({ adminGroup: adminGroupId }).countDocuments();
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };
