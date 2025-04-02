import redisClient from '../config/redis.js';

export const saveMatchData = async (matchId, data) =>{
    try {
        await redisClient.set(`match:${matchId}`, JSON.stringify(data));
        console.log(`Match data saved for match ID: ${matchId}`);
    } catch (error) {
        console.error(`Error saving match data :`, error);
    }
}


export const getMatchData  = async (matchId) =>{
    try {
        const data = await redisClient.get(`match:${matchId}`);

        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving match data:', error);
        return null;
    }
}


export const deleteMatchData = async (matchId) => {
    try {
        console.log(`Match data deleted for match ID: ${matchId}`);
        return await redisClient.del(`match:${matchId}`);
    } catch (error) {
        console.error(`Error deleting match data:`, error);
        return null
    }
}