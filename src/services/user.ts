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
  
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
  
      if (existingUser) {
        throw new Error("User with that email or username already exists");
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