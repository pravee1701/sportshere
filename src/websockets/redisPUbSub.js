import redis from 'redis';
import { broadcastToRoom } from './websocket.js';

const publisher = redis.createClient();
const subscriber = redis.createClient();

publisher.on('error', (err) => {
    console.error('Redis Publisher Error:', err);
});

subscriber.on('error', (err) => {
    console.error('Redis Subscriber Error:', err);
});

// Connect the Redis clients
await publisher.connect();
await subscriber.connect();

// Subscribe to the match-updates channel and handle messages
await subscriber.subscribe('match-updates', (message, channel) => {
    if (channel === 'match-updates') {
        try {
            const { matchId, data } = JSON.parse(message);
            console.log(`Broadcasting update for match: ${matchId}`, data);

            // Broadcast the update to all WebSocket clients in the match room
            broadcastToRoom(matchId, 'matchUpdate', data);
        } catch (error) {
            console.error('Error parsing message from Redis:', error);
        }
    }
});

export { publisher, subscriber };