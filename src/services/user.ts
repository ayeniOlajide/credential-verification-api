import Fuse from 'fuse.js'
import { IUser, User } from '../models/user'
import { UserId, IUserFind, IUserLogin, IUserRegistration, IUserSearch, IUserUpdate, IUsers, IUserProfileUpdate, IUserCreate } from '../types/user'
import Cryptr from 'cryptr';
import { normalizeDegreeSearch } from '../utils/searchNormalizer';

const cryptr = new Cryptr(process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET : "validation")

export type USER_DETAILS = Pick<IUser, "username" | "firstName" | "lastName" | "email" | "phone" | "location" | "longOtpCode" | "dateOfBirth" | "bio" | "qualifications" | "accountType"  > | null;
export { IUser };


// tested with jest
export const getUser = async (userData: IUserFind): Promise<IUser | null> => {
  try {
    const { userId, longOtpCode, email, username } = userData;

    if (!userId && !email && !username && !longOtpCode) {
      throw new Error("At least one user identifier is required")
    }

    if (userData.userId) {
      const user = await User.findById(userData.userId);
      if (user) {
        console.log("User found by ID");
        return user;
      }
    }

    if (userData.email) {
      const user = await User.findOne({ email: userData.email });
      if (user) {
        console.log("User found by email");
        return user;
      }
    }

    if (userData.username) {
      const user = await User.findOne({ username: userData.username });
      if (user) {
        console.log("User found by username");
        return user;
      }
    }

    if (userData.longOtpCode) {
      const user = await User.findOne({ longOtpCode: userData.longOtpCode });
      if (user) {
        console.log("User found by longOtpCode");
        return user;
      }
    }

    // If no user found by any identifier
    console.warn("User not found with provided identifiers.");
    return null;

  } catch (error) {
    console.error("Error in getUser:", error);
    throw new Error((error as Error).message);
  }
};


//tested with jest
export const createUser = async (userData: IUserCreate): Promise<IUser> => {
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
    const isUpdated = await User.findOneAndUpdate({ _id: userId })
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

//tested with jest
export const searchUser = async (searchData: IUserSearch): Promise<IUser[] | null> => {
  try {
    if (!searchData?.searchText) {
      throw new Error("Enter relevant SearchText");
    }

    // ✅ Normalize degree-related input (e.g. BSC → Bachelor)
    const normalizedSearch = normalizeDegreeSearch(searchData.searchText);

    // 🔍 Load users with their qualifications populated
    const users = await User.find({ ...searchData.filters }).populate("qualifications");

    // 🔍 Setup Fuse.js fuzzy search
    const fuse = new Fuse(users, {
      keys: [
        "firstName",
        "username",
        "lastName",
        "location",
        "qualifications.degree",
        "email",
        "qualifications.fieldOfExpertise",
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
    });

    // 🔍 Use normalized search input
    const results = fuse.search(normalizedSearch);
    const matchedUsers = results.map(result => result.item);

    return matchedUsers;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};


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

export const getAdminUsers = async (pagination?: Pagination, filter?: USER_DETAILS): Promise<IUsers> => {
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


// export const registerUser = async (userData: IUserRegistration): Promise<IUser> => {
//   try {
//     if (!userData.email) throw new Error("Email is required");

//     const email = userData.email.trim().toLowerCase();

//     //check for existing username and email
//     const existingEmail = await User.findOne({ email });

//     if (existingEmail) {
//       throw new Error("Email already exists");
//     }

//     const user = new User({
//       password: userData.password,
//       email,
//     });

//     await user.save();

//     return user;
//   } catch (error) {
//     throw new Error((error as Error).message || "User registration failed");
//   }
// };


// export const loginUser = async (userData: IUserLogin): Promise<IUser | null> => {
//   try {

//     const identifier = userData.email?.trim().toLowerCase() || userData.username?.trim().toLowerCase();
//     const password = userData.password;

//     if(!identifier) throw new Error ("Email or Username is required");
//     if(!password) throw new Error ("Password is required");


//     const user = await User.findOne({ 
//       $or: [{ email: identifier }, { username: identifier }], 
//     });

//     if(!user) throw new Error("Invalid Credentials")

//     return user

//   } catch (error) {
//     throw new Error((error as error).message  || "Login failed")
//   }
// }




// export const updateUserProfile = async (userId: UserId, userData: IUserProfileUpdate): Promise<IUser> => {
//   try {
//     const user = await User.findById(userId);
//     if(!user) throw new Error("User not found");

//     Object.assign(user, userData);
//     await user.save();

//     return user
//   } catch (error) {
//     throw new Error((error as Error).message || "Profile Update Failed")
//   }
//  };

// export const confirmUser = async (userId: string): Promise<boolean> => {
//   try {
//     if (!userId) throw new Error("Account not found, contact support")
//     const isUpdated = await User.findOneAndUpdate({ _id: userId }, { kycStatus: true })
//     if (!isUpdated) return false;
//     return true;
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// }

// export const updateUser = async (userId: UserId, userData: IUserUpdate): Promise<boolean> => {
//   try {
//     const isUpdated = await User.findOneAndUpdate({ _id: userId }, userData);
//     if (!isUpdated) throw new Error("Cannot update user");
//     return true;
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// };

// export const searchUser = async (searchData: IUserSearch): Promise<IUser[] | null> => {
//   try {
//     let response;
//     const searchText = searchData.searchText;
//     const users = await User.find({ ...searchData.searchFilter })
//     let fuse = new Fuse(users, {
//       keys: ["lastName", "firstName", "userName", "email"],
//       findAllMatches: false,
//       threshold: 0.3
//     })

//     let results;
//     results = fuse.search({
//       $or: [
//         { lastName: searchText },
//         { firstName: searchText },
//         { email: searchText },
//         { userName: searchText },
//       ],
//     })
//     response = results.map((res: any) => res.item);
//     return response;
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// }

// export const getUsers = async (pagination?: Pagination, filter?: USER_DETAILS): Promise<IUsers> => {
//   try {
//     let users: IUser[] = [];
//     let count = 0;
//     const pageOptions = {
//       page: pagination?.from || 0,
//       limit: pagination?.limit || 20,
//       sort: pagination?.orderBy || "createdAt",
//       direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
//     }


//     users = await User.find({ ...filter })
//       .sort([[pageOptions.sort, pageOptions.direction]])
//       .skip(pageOptions.page * pageOptions.limit)
//       .limit(pageOptions.limit)
//       .exec();
//     count = await User.find({ ...filter }).countDocuments();
//     return { users, count };
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// };

// export const getAdminUsers = async (pagination?: Pagination, filter?: USER_DETAILS): Promise<IUsers> => {
//   try {
//     let users: IUser[] = []
//     let count = 0;
//     const pageOptions = {
//       page: pagination?.from || 0,
//       limit: pagination?.limit || 20,
//       Sort: pagination?.orderBy || "createdAt",
//       direction: pagination?.sortOrder ? pagination?.sortOrder : SortOrder.DESC
//     }

//     users = await User.find({ ...filter }).populate("role")
//       .sort([[pageOptions.Sort, pageOptions.direction]])
//       .skip(pageOptions.page * pageOptions.limit)
//       .limit(pageOptions.limit)
//       .exec();
//     count = await User.find({ ...filter }).countDocuments()
//     return { users, count }
//   } catch (error) {
//     throw new Error((error as Error).message)
//   }
// }

