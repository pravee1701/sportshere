import { body , param } from 'express-validator';

export const validateMatchId = [
    param('matchId')
    .isUUID()
    .withMessage('Match ID must be a valid UUID')
]

export const validateMatchData = [
    body('team1').isString().withMessage('Team 1 must be a string').notEmpty().withMessage('Team 1 is required'),
    body('team2').isString().withMessage('Team 2 must be a string').notEmpty().withMessage('Team 2 is required'),
    body('score1').isInt({ min: 0 }).withMessage('Score 1 must be a non-negative integer'),
    body('score2').isInt({ min: 0 }).withMessage('Score 2 must be a non-negative integer'),
    body('status')
      .isIn(['ongoing', 'completed', 'scheduled'])
      .withMessage('Status must be one of: ongoing, completed, scheduled'),
    body('startTime').isISO8601().withMessage('Start time must be a valid ISO 8601 date'),
  ];