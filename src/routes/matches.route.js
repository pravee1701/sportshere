import express from 'express';
import { validateMatchData, validateMatchId } from '../validators/match.validator.js';
import {  createMatch, deleteMatch, getAllMatches, getMatch, saveCompleteMatch, updateMatch } from '../controllers/matches.controller.js';
import { handleValidationErrors } from '../utils/common.utils.js';

const router = express.Router();

router.post("/", validateMatchData, handleValidationErrors, createMatch);

router.put("/:matchId", validateMatchId, validateMatchData, handleValidationErrors, updateMatch);

router.get("/", getAllMatches);

router.get("/:matchId", validateMatchId, handleValidationErrors, getMatch);

router.delete("/:matchId", validateMatchId, handleValidationErrors, deleteMatch);

router.post("/:matchId/complete", validateMatchId, handleValidationErrors, saveCompleteMatch);

export default router;
