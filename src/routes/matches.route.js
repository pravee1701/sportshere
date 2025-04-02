import express from 'express';
import { validateMatchData, validateMatchId } from '../validators/match.validator.js';
import { createOrUpdateMatch, deleteMatch, getMatch } from '../controllers/matches.controller.js';
import { handleValidationErrors } from '../utils/common.utils.js';

const router = express.Router();

router.post("/", [...validateMatchData], handleValidationErrors, createOrUpdateMatch);

router.post("/:matchId", [...validateMatchId, ...validateMatchData], handleValidationErrors, createOrUpdateMatch);

router.get("/", handleValidationErrors, getMatch);

router.get("/:matchId", validateMatchId, handleValidationErrors, getMatch);

router.delete("/:matchId", validateMatchId, handleValidationErrors, deleteMatch);

export default router;
