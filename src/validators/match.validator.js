import { body , param } from 'express-validator';

export const validateMatchId = [
    param('matchId')
    .isUUID()
    .withMessage('Match ID must be a valid UUID')
]

export const validateMatchData = [
    body("team1").isString().withMessage("Team 1 must be a string"),
    body("team2").isString().withMessage("Team 2 must be a string"),
    body("score1").isString().withMessage("Score 1 must be a string"),
    body("score2").isString().withMessage("Score 2 must be a string"),
    body("status")
    .isIn(['ongoing', 'completed', 'scheduled'])
    .withMessage("Status must be one of the following: ongoing, completed, scheduled"),
]