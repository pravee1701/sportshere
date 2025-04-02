import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from "./app.js";
import matchSocketHandler from './websockets/matchSocket.js';


dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }

});


matchSocketHandler(io);



const PORT = process.env.PORT || 8080;

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})