import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import { handleSocketEvents } from "./socketEvents.js";

let io;

export const initializeWebSocketServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST'],
        }
    });

    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    // Handle socket events
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        handleSocketEvents(io, socket);
    });

    console.log('WebSocket server initialized');
};

// Broadcast a message to all clients in a specific match room
export const broadcastToRoom = (matchId, event, data) => {
    if (io) {
        io.to(matchId).emit(event, data);
    }
};