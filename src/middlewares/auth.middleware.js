import { sendApiResponse } from "../utils/common.utils.js";
import jwt from 'jsonwebtoken';

export const authUser = (req, res, next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return sendApiResponse(res, 401, false, "Unauthorized");
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    } catch (error) {
        return sendApiResponse(res, 401, false, "Invalid token");
    }
}