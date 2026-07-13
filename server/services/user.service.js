import { redis } from "../utils/redis.js";
import userModel from "../models/user.model.js";
// create user service
export const getUserById = async (id) => {
    const userJSON = await redis.get(id);
    if (userJSON) {
        const user = JSON.parse(userJSON || "{}");
        return user;
    }
    return null;
};
export const getAllUsersService = async (res) => {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        users,
    });
};
export const updateUserRoleService = async (res, id, role) => {
    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(200).json({
        success: true,
        user,
    });
};
