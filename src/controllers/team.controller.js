import Team from '../models/team.model.js';
import { sendApiResponse } from '../utils/common.utils.js';


export const createTeam = async (req, res) => {
  const { name, city, coach } = req.body;

  try {
    const team = new Team({ name, city, coach });
    await team.save();
    sendApiResponse(res, 201, true, 'Team created successfully', team);
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to create team');
  }
};


export const updateTeam = async (req, res) => {
  const { teamId } = req.params;
  const updates = req.body;

  try {
    const team = await Team.findByIdAndUpdate(teamId, updates, { new: true });
    if (!team) {
      return sendApiResponse(res, 404, false, 'Team not found');
    }
    sendApiResponse(res, 200, true, 'Team updated successfully', team);
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to update team');
  }
};


export const getTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return sendApiResponse(res, 404, false, 'Team not found');
    }
    sendApiResponse(res, 200, true, 'Team retrieved successfully', team);
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to retrieve team');
  }
};


export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    sendApiResponse(res, 200, true, 'Teams retrieved successfully', teams);
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to retrieve teams');
  }
};


export const deleteTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findByIdAndDelete(teamId);
    if (!team) {
      return sendApiResponse(res, 404, false, 'Team not found');
    }
    sendApiResponse(res, 200, true, 'Team deleted successfully');
  } catch (error) {
    sendApiResponse(res, 500, false, 'Failed to delete team');
  }
};