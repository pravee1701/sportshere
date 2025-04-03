import { response } from 'express';
import { deleteCompletedMatchFromDB, getCompletedMatchesFromDB, getCompletedMatchFromDB, saveCompleteMatchToDB, saveMatchToDB } from '../services/match.db.service.js';
import { saveMatchData, getMatchData, deleteMatchData } from '../services/match.redis.service.js';
import { sendApiResponse } from '../utils/common.utils.js';
import { v4 as uuidv4 } from 'uuid';
import { publisher } from '../websockets/redisPUbSub.js';


export const createMatch = async (req, res) => {
  const matchData = req.body;

  const matchId = uuidv4();
  matchData.startTime = matchData.startTime || new Date();

  try {
    await saveMatchData(matchId, matchData);

    const response = await saveMatchToDB(matchId, matchData);

    sendApiResponse(res, 201, true, 'Match created successfully', response);
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to create match');
  }
};


export const updateMatch = async (req, res) => {
  const { matchId } = req.params;
  const matchData = req.body;

  try {
    let existingMatch = await getMatchData(matchId); 
    if (!existingMatch) {
      existingMatch = await getCompletedMatchFromDB(matchId); 
    }

    if (!existingMatch) {
      return sendApiResponse(res, 404, false, 'Match not found');
    }

    const updatedMatch =  { ...existingMatch, ...matchData };
    await saveMatchData(matchId, updatedMatch);

    await saveMatchToDB(matchId, updatedMatch);

    publisher.publish('match-updates', JSON.stringify({ matchId, ...updatedMatch }));

    sendApiResponse(res, 200, true, 'Match updated successfully', updatedMatch);
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to update match');
  }
};

export const getMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    let matchData = await getMatchData(matchId);
    if (!matchData) {
      matchData = await getCompletedMatchFromDB(matchId);
    }
    if (matchData) {
      sendApiResponse(res, 200, true, 'Match data retrieved successfully', matchData);
    } else {
      sendApiResponse(res, 404, false, 'Match not found');
    }
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to retrieve match data');
  }
};

export const getAllMatches = async (req, res) => {
  try {
    const matches = await getCompletedMatchesFromDB();
    sendApiResponse(res, 200, true, 'All matches retrieved successfully', matches);
  } catch (error) {
    sendApiResponse(res, 500, false, "Failed to retrieve matches");
  }
}

export const deleteMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    await deleteMatchData(matchId);
    await deleteCompletedMatchFromDB(matchId);

    sendApiResponse(res, 200, true, 'Match data deleted successfully');
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to delete match data');
  }
};

export const saveCompleteMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    const matchData = await getMatchData(matchId);
    if (!matchData) {
      return sendApiResponse(res, 404, false, "Match not found")
    }
    const data = await saveCompleteMatchToDB(matchId, matchData);

    sendApiResponse(res, 200, true, "Match saved to DB successfully", data);
  } catch (error) {
    sendApiResponse(res, 500, false, "Failed to save match to DB");
  }
}