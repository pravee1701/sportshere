import { getMatchData } from '../services/match.redis.service.js';


const matchSocketHandler = (io) => {
    io.on('connection', (socket)=>{
        console.log("A user connected:", socket.id);

        socket.on('joinMatch', async (matchId) =>{
            console.log(`User joined match: ${matchId}`);
            socket.join(matchId);

            const matchData = await getMatchData(matchId);

            if(matchData){
                socket.emit('matchUpdate', matchData);
            }
        });

        socket.on('updateMatch', (matchId, data) =>{
            console.log(`Match updated: ${matchId}`, data);
            io.to(matchId).emit('matchUpdate', data);
        });

        socket.on('disconnect', () =>{
            console.log("User disconnected:", socket.id);
        });
    });
};

export default matchSocketHandler;