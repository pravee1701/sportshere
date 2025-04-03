import axios from "axios";
import { API_CONFIG } from "../config/api.config.js";
import redisClient from '../config/redis.js';

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


        const liveMatches = response.data.response.map((match) => ({
            matchId: match.id,
            team1: match.teams?.home?.name || 'Unknown',
            team2: match.teams?.away?.name || 'Unknown',
            score1: sport === "football" ? match.goals?.home || 0: match.scores?.home?.total || 0,
            score2: sport === "football" ? match.goals?.away || 0: match.scores?.away?.total || 0,
            status: match.status?.short === 'LIVE' ? 'ongoing' : match.status?.short?.toLowerCase() || 'unknown',
            startTime: match.fixture?.date || null,
            endTime: match.status?.short === 'FT' ? new Date() : null,
        }));

        // Save live matches to Redis with merging
        await Promise.all(
            liveMatches.map(async (match) => {
                const redisKey = `match:${match.matchId}`;
                // Fetch existing data from Redis
                const existingData = await new Promise((resolve, reject) => {
                    redisClient.get(redisKey, (err, data) => {
                        if (err) return reject(err);
                        resolve(data ? JSON.parse(data) : {});
                    });
                });

                // Merge existing data with the new data
                const updatedData = { ...existingData, ...match };

                // Save the merged data back to Redis
                await new Promise((resolve, reject) => {
                    redisClient.set(redisKey, JSON.stringify(updatedData), (err) => {
                        if (err) return reject(err);
                        console.log(`Match ${match.matchId} updated in Redis`);
                        resolve();
                    });
                });
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