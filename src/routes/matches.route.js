import express from 'express';
import { validationResult } from 'express-validator';
import { validateMatchData, validateMatchId } from '../validators/match.validator';
import { createOrUpdateMatch, deleteMatch, getMatch } from '../controllers/matches.controller';
import { handleValidationErrors } from '../utils/common.utils';

const router = express.Router();



router.post("/:matchId", [...validateMatchId,...validateMatchData], handleValidationErrors, createOrUpdateMatch);

router.get("/:matchId", validateMatchId, handleValidationErrors, getMatch);

router.delete("/:matchId", validateMatchId, handleValidationErrors, deleteMatch);

export default router;
