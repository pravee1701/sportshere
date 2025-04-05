import Match from "../models/match.model.js";
import { saveMatchPrediction } from "../services/match.db.service.js";
import { predictMatchOutcome } from "../services/prediction.service.js";
import { getTeamAverageScore } from "../services/team.service.js";
import { sendApiResponse } from "../utils/common.utils.js";
import { broadcastToRoom } from "../websockets/websocket.js";



export const generateMatchPrediction = async (req, res) => {
    const { sport, team1, team2 } = req.body;

    try {
        const match = await Match.findOne({ team1, team2});
    
        if(!match){
            return sendApiResponse(res, 404, false, "Match not found");
        }
    
        const matchId = match.matchId;

        const team1AvgScore = await getTeamAverageScore(team1, sport);
        const team2AvgScore = await getTeamAverageScore(team2, sport);

        const prediction = await predictMatchOutcome(team1AvgScore, team2AvgScore);

        await saveMatchPrediction(matchId, prediction);

        broadcastToRoom(matchId, 'updateMatch', {
            matchId,
            team1,
            team2,
            team1AvgScore,
            team2AvgScore,
            prediction,
        });

        sendApiResponse(res, 200, true, "Match prediction generated successfully", {
            matchId,
            team1,
            team2,
            team1AvgScore,
            team2AvgScore,
            prediction,
        });



    } catch (error) {
        cosnole.error("Error generating match prediction:", error);
        sendApiResponse(res, 500, false, "Failed to generate match prediction");
    }
}