import Fuse from 'fuse.js'
import { IUser, User } from '../models/user'
import { UserId, IUserFind, IUserLogin, IUserRegistration, IUserSearch, IUserUpdate, IUsers } from '../types/user'
import Cryptr from 'cryptr'

const cryptr = new Cryptr(process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "Credenza")

export type USER_DETAILS = Pick<IUser, "username" | "firstName" | "lastName" | "email" | "phone" | "emailVerified" | "longOtpCode"> | null;
export { IUser };

export const getUser = async (userData: IUserFind): Promise<IUser | null> => {
  try {
    let user: IUser | null;
    if (userData.hasOwnProperty("userId") && userData.userId) {
      user = await User.findOne({ _id: userData.userId })
      if (user) return user;
    }
    if (userData.hasOwnProperty("username") && userData.username) {
      user = await User.findOne({ username: userData.username })
      if (user) return user;
    }
    if (userData.hasOwnProperty("email") && userData.email) {
      user = await User.findOne({ email: userData.email })
      if (user) return user;
    }
    if (userData.hasOwnProperty("longOtpCode") && userData.longOtpCode) {
      user = await User.findOne({ longOtpCode: userData.longOtpCode });
      if (user) return user;
    }
    return null;
  } catch (error) {
    throw new Error((error as Error).message)
  }
}

export const createUser = async (userData: IUserRegistration): Promise<IUser> => {
  try {
    if (!userData.email) throw new Error("Email is required");

    const email = userData.email.trim().toLowerCase();
    const username = userData.username?.trim().toLowerCase();

    //check for existing username and email
    const existingEmail = await User.findOne({ email });

    const existingUsername = username ? await User.findOne({ username }) : null

    if (existingEmail && existingUsername) {
      throw new Error("Email and username already exists");
    }
    if (existingEmail) {
      throw new Error("Email already exists");
    }
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const user = new User({
      ...userData,
      email,
      username,
    });

    await user.save();

    return user;
  } catch (error) {
    throw new Error((error as Error).message || "User creation failed");
  }
};

export const confirmUser = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) throw new Error("Account not found, contact support")
    const isUpdated = await User.findOneAndUpdate({ _id: userId }, { kycStatus: true })
    if (!isUpdated) return false;
    return true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const updateUser = async (userId: UserId, userData: IUserUpdate): Promise<boolean> => {
  try {
    const isUpdated = await User.findOneAndUpdate({ _id: userId }, userData);
    if (!isUpdated) throw new Error("Cannot update user");
    return true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const searchUser = async (searchData: IUserSearch): Promise<Array<IUser> | null> => {
  try {
    let response;
    const searchText = searchData.searchText;
    const users = await User.find({ ...searchData.searchFilter })
    let fuse = new Fuse(users, {
      keys: ["lastName", "firstName", "userName", "email"],
      findAllMatches: false,
      threshold: 0.3
    })

    let results;
    results = fuse.search({
      $or: [
        { lastName: searchText },
        { firstName: searchText },
        { email: searchText },
        { userName: searchText },
      ],
    })
    response = results.map((res: any) => res.item);
    return response;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const getUsers = async (pagination?: Pagination, filter?: USER_DETAILS): Promise<IUsers> => {
  try {
    let users: IUser[] = [];
    let count = 0;
    const pageOptions = {
      page: pagination?.from || 0,
      limit: pagination?.limit || 20,
      sort: pagination?.orderBy || "createdAt",
      direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
    }


    users = await User.find({ ...filter })
      .sort([[pageOptions.sort, pageOptions.direction]])
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();
    count = await User.find({ ...filter }).countDocuments();
    return { users, count };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getAdminUsers = async (pagination?: Pagination, filter?: USER_DETAILS): Promnise<IUsers> => {
  try {
    let users: IUser[] = []
    let count = 0;
    const pageOptions = {
      page: pagination?.from || 0,
      limit: pagination?.limit || 20,
      Sort: pagination?.orderBy || "createdAt",
      direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
    }

    users = await User.find({ ...filter }).populate("role")
      .sort([[pageOptions.Sort, pageOptions.direction]])
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();
    count = await User.find({ ...filter }).countDocuments()
    return { users, count }
  } catch (error) {
    throw new Error((error as Error).message)
  }
}