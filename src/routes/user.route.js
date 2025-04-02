import express from 'express';
import { validateUserLogin, validateUserRegistration } from '../validators/user.validator.js';
import { handleValidationErrors } from '../utils/common.utils.js';
import { authUser } from '../middlewares/auth.middleware.js';
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';


const router = express.Router();

router.post("/register", validateUserRegistration, handleValidationErrors, registerUser);

router.post("/login", validateUserLogin, handleValidationErrors, loginUser);

router.post("/profile", authUser, getUserProfile);

router.post("/logout", authUser, logoutUser);


export default router;