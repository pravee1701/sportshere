import express from 'express';
import { authUser } from '../middlewares/auth.middleware.js';
import { generateMatchPrediction } from '../controllers/prediction.controller.js';


const router = express.Router();

router.post("/", authUser, generateMatchPrediction);

export default router;