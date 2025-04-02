import { body, param } from 'express-validator';

export const validateTeamId = [
  param('teamId').isMongoId().withMessage('Team ID must be a valid MongoDB ObjectId'),
];

export const validateTeamData = [
  body('name').isString().withMessage('Team name must be a string').notEmpty().withMessage('Team name is required'),
  body('city').isString().withMessage('City must be a string').notEmpty().withMessage('City is required'),
  body('coach').isString().withMessage('Coach name must be a string').notEmpty().withMessage('Coach name is required'),
];