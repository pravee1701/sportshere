import express from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { generateMatchPrediction } from '../controllers/prediction.controller.js';
import { validateMatchData } from '../validators/match.validator.js';
import { handleValidationErrors } from '../utils/common.utils.js';


const router = express.Router();

router.post("/", authUser, validateMatchData, handleValidationErrors, generateMatchPrediction);

export default router;