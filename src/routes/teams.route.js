import express from 'express';
import { validateTeamData, validateTeamId } from '../validators/team.validator.js';
import { handleValidationErrors } from '../utils/common.utils.js';
import { createTeam, deleteTeam, getAllTeams, getTeam, updateTeam } from '../controllers/team.controller.js';


const router = express.Router();


router.post('/', validateTeamData, handleValidationErrors, createTeam);


router.put('/:teamId', validateTeamId, validateTeamData, handleValidationErrors, updateTeam);


router.get('/:teamId', validateTeamId, handleValidationErrors, getTeam);


router.get('/', getAllTeams);


router.delete('/:teamId', validateTeamId, handleValidationErrors, deleteTeam);

export default router;