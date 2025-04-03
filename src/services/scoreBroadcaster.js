import { broadcastToRoom } from "../websockets/websocket";
import { getLiveScores } from "./liveScores.service";


const SUPPORTED_SPORTS = ['football', 'basketball'];

export const fetchAndBroadcastAllScores = async () => {
    try {
        for(const sport of SUPPORTED_SPORTS){
            const liveScores = await getLiveScores(sport);

            liveScores.forEach((match) => {
                const { matchId, team1, team2, score1, score2, status } = match;

                broadcastToRoom(matchId, 'updateMatch', {
                    matchId,
                    team1,
                    team2,
                    score1,
                    score2,
                    status,
                    sport,
                });
            });
        }
    } catch (error) {
        console.error('Error broadcasting live scores:', error);
    }
};

// Fetching and broadcast scores every 30 seconds
setInterval(fetchAndBroadcastAllScores, 30000);