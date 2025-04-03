import axios from "axios";
import Match from "../models/match.model.js";
import { API_CONFIG } from "../config/api.config.js";

export const getLiveScores = async (sport) => {
    try {
        const config = API_CONFIG[sport];
        if (!config) {
            throw new Error(`Sport ${sport} not found`);
        }

        if (!config.baseUrl || !config.headers['x-rapidapi-key']) {
            throw new Error(`Missing configuration for ${sport}. Check your environment variables.`);
        }


        const response = await axios.get(`${config.baseUrl}${config.liveEndpoint}`, {
            headers: config.headers,
            params: {
                live:'all',
            },
        });

        const liveMatches = response.data.response.map((match) => ({
            matchId: match.id,
            team1: match.teams?.home?.name || 'Unknown',
            team2: match.teams?.away?.name || 'Unknown',
            score1: match.scores?.home?.total || 0,
            score2: match.scores?.away?.total || 0,
            status: match.status?.short === 'LIVE' ? 'ongoing' : match.status?.short?.toLowerCase() || 'unknown',
            startTime: match.fixture?.date || null,
            endTime: match.status?.short === 'FT' ? new Date() : null,
        }));

        await Promise.all(
            liveMatches.map((match) =>
                Match.findOneAndUpdate(
                    { matchId: match.matchId },
                    match,
                    { upsert: true, new: true }
                )
            )
        );

        return liveMatches;
    } catch (error) {
        if (error.response) {
            console.error(`API Error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            console.error('No response received from API:', error.request);
        } else {
            console.error('Error setting up API request:', error.message);
        }
        throw error;
    }
};