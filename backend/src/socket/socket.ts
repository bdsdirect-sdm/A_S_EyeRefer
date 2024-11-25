import { io } from "..";
import { joinRoom, sendMessage } from './event'

io.on('connection', (socket) => {
    console.log('Client connected');

    joinRoom(socket);

    sendMessage(socket);

    socket.on('disconnect', ()=>{
        console.log('Client disconnected');
    });
});