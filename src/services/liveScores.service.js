import axios from "axios";
import { API_CONFIG } from "../config/api.config.js";
import redisClient from '../config/redis.js';
import { v4 as uuidv4 } from 'uuid';

export const getLiveScores = async (sport, date = new Date()) => {
    try {
        const config = API_CONFIG[sport];
        if (!config) {
            throw new Error(`Sport ${sport} not found`);
        }

        if (!config.baseUrl || !config.headers['x-rapidapi-key']) {
            throw new Error(`Missing configuration for ${sport}. Check your environment variables.`);
        }

        // Format the date as YYYY-MM-DD
        const getFormattedDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedDate = getFormattedDate(date);

        let response;
        if (sport === "football") {
            response = await axios.get(`${config.baseUrl}${config.liveEndpoint}`, {
                headers: config.headers,
                params: {
                    live: 'all',
                },
            });
        } else if (sport === "basketball") {
            response = await axios.get(`${config.baseUrl}${config.liveEndpoint}`, {
                headers: config.headers,
                params: {
                    date: formattedDate,
                },
            });
        } else {
            throw new Error(`Unsupported sport: ${sport}`);
        }

        console.log("response===>", response.data.response[0]);
        const liveMatches = response.data.response.map((match) => ({
            originalMatchId: match.id ? match.id : match.fixture?.id,
            team1: match.teams?.home?.name || 'Unknown',
            team2: match.teams?.away?.name || 'Unknown',
            score1: sport === "football" ? match.goals?.home || 0 : match.scores?.home?.total || 0,
            score2: sport === "football" ? match.goals?.away || 0 : match.scores?.away?.total || 0,
            status: match.status?.short === 'LIVE' ? 'ongoing' : match.status?.short?.toLowerCase() || 'unknown',
            startTime: match.fixture?.date || null,
            endTime: match.status?.short === 'FT' ? new Date() : null,
        }));

        console.log("liveMatches===>", liveMatches[0]);
        // Save live matches to Redis with merging
        await Promise.all(
            liveMatches.map(async (match) => {
                const redisKeyForOriginalId = `match:${match.originalMatchId}`;
                console.log("match===>", match);
                try {
                    // Check if the match already exists in Redis
                    const existingData = await redisClient.get(redisKeyForOriginalId);
                    let matchId;

                    if (existingData) {
                        // If the match exists, retrieve the existing matchId
                        const parsedData = JSON.parse(existingData);
                        matchId = parsedData.matchId;
                    } else {
                        // If the match does not exist, generate a new UUID
                        matchId = uuidv4();
                        // Save the mapping of originalMatchId to matchId
                        await redisClient.set(redisKeyForOriginalId, JSON.stringify({ matchId }));
                    }

                    // Use the matchId as the Redis key
                    const redisKey = `match:${matchId}`;

                    // Merge existing data with the new data
                    const updatedData = { matchId, ...match };
                    console.log("===>", updatedData);
                    // Save the merged data back to Redis
                    await redisClient.set(redisKey, JSON.stringify(updatedData));
                } catch (err) {
                    console.error(`Error processing match ${match.originalMatchId}:`, err.message);
                }
            })
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