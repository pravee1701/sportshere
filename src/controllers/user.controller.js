import { sendApiResponse } from "../utils/common.utils.js";
import userModel from '../models/user.model.js';
import { createUser } from '../services/user.service.js';

export const registerUser = async (req, res) =>{
    const {firstname, lastname, email, password} = req.body;

    if(!fullname || !email || !password){
        return sendApiResponse(res, 400, false, "All fields are required");
    }
    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return sendApiResponse(res, 400, false, "User already exists");
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await createUser({firstname, lastname, email, password: hashedPassword});

        sendApiResponse(res, 201, true, "User created successfully", {
                user
        });
    } catch (error) {
        sendApiResponse(res, 500, false, "Failed to register user");
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email, !password){
        return sendApiResponse(res, 400, false, "Email and password are required");
    }
    try {
        const user = await userModel.findOne({email}).select("+password")

        if(!user){
            return sendApiResponse(res, 404, false, "User not found")
        }
        const isValidPassword = await user.comparePassword(password);

        if(!isValidPassword){
            return sendApiResponse(res, 401, false, "Invalid email or password");
        }

        const token = user.generateAuthToken();

        req.cookie("token", token);
        sendApiResponse(res, 200, true, "Logged in successfully", {
            user,
            token
            });
    } catch (error) {
        sendApiResponse(res, 500, false, "Failed to login user");
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = req.user || null;
        if(!user){
            return sendApiResponse(res, 404, false, "User not found");
            }
        sendApiResponse(res, 200, true, "user profile retrieved successfully"  )
    } catch (error) {
        sendApiResponse(res, 500, false, "Failed to retreive user profile");
    }
};

export const logoutUser = async (req, res) =>{
    req.clearCookie("token");
    sendApiResponse(res, 200, true, "Logged out successfully")
}