import { saveMatchData, getMatchData, deleteMatchData } from '../services/matchService.js';
import { sendApiResponse } from '../utils/common.utils.js';
import { v4 as uuidv4 } from 'uuid';


export const createOrUpdateMatch = async (req, res) => {
  let { matchId } = req.params;
  const matchData = req.body;

  try {

    if(!matchId){
      matchId = uuidv4();
    }
    await saveMatchData(matchId, matchData);
    sendApiResponse(res, 200, true, 'Match data saved successfully');
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to save match data');
  }
};


export const getMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    const matchData = await getMatchData(matchId);
    if (matchData) {
      sendApiResponse(res, 200, true, 'Match data retrieved successfully', matchData);
    } else {
      sendApiResponse(res, 404, false, 'Match not found');
    }
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to retrieve match data');
  }
};


export const deleteMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    await deleteMatchData(matchId);
    sendApiResponse(res, 200, true, 'Match data deleted successfully');
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to delete match data');
  }
};