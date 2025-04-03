import { getCompletedMatchFromDB } from "../services/match.db.service.js";
import { getMatchData } from "../services/match.redis.service.js";
import { publisher } from "./redisPUbSub.js";


export const handleSocketEvents = (io, socket) =>{

    // user joining a match room
    socket.on('joinMatch', async (matchId) => {
        try {
            console.log(`User joined match: ${matchId}`);
            socket.join(matchId);

            // Fetch match data from redis
            let matchData = await getMatchData(matchId);

            if (!matchData) {
                matchData = await getCompletedMatchFromDB(matchId);
                }
            if(matchData){
                socket.emit('matchUpdate', matchData);
            } else {
                socket.emit('error', {message: 'Match not found'});
            }
        } catch (error) {
            console.log('Error fetching match data:', error);
            socket.emit('error', {message: 'Failed to fetch match data'});
        }
    });

    // Handle match updates

    socket.on('updateMatch', async (matchId, newData) => {
        try {
            console.log(`Match updated: ${matchId}`, newData);

            // Check if the Redis client is connected
            if (!publisher.isOpen) {
                console.error('Redis Publisher is not connected');
                return socket.emit('error', { message: 'Redis connection error' });
            }

            // Fetch the existing match data from Redis
            let existingData = await publisher.get(`match:${matchId}`);
            existingData = existingData ? JSON.parse(existingData) : {};

            // Merge the existing data with the new data
            const updatedData = { ...existingData, ...newData };
            // Store the merged data back in Redis
            await publisher.set(`match:${matchId}`, JSON.stringify(updatedData));

            // Validate and stringify the data before publishing
            const payload = JSON.stringify({ matchId, data: updatedData });

            // Publish the update to Redis Pub/Sub
            await publisher.publish('match-updates', payload);

            // Emit the update to all clients in the match room
            io.to(matchId).emit('matchUpdate', updatedData);

            console.log(`Broadcasting update for match: ${matchId}`, updatedData);
        } catch (error) {
            console.error('Error updating match:', error);
            socket.emit('error', { message: 'Failed to update match' });
        }
    });

    // user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
};