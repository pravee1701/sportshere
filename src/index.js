import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import matchSocketHandler from './websockets/matchSocket';
import matchesRoute from './routes/matches.route.js';


dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }

});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/matches', matchesRoute);

matchSocketHandler(io);



const PORT = process.env.PORT || 8080;

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})