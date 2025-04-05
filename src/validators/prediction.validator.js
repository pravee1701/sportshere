import { body } from 'express-validator';

export const validatePredictionData = [
    body('team1').isString().withMessage('Team 1 must be a string').notEmpty().withMessage('Team 1 is required'),
    body('team2').isString().withMessage('Team 2 must be a string').notEmpty().withMessage('Team 2 is required'),
    body('sport').isString().withMessage('Sport must be a string').notEmpty().withMessage('Sport is required and only football and basketball are allowed'),
]