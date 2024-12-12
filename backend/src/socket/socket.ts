import {Server} from 'socket.io'
import { joinRoom, sendMessage, joinNotificationRoom, Notificationsocket } from './event'

export let io:Server

export const setSocket = (httpServer:any) => {

    io = new Server(httpServer,{
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT"],
            credentials: true
            }
    })
   
    io.on('connection', (socket) => {
        console.log('Client connected');
        
        socket.on('joinchat', async(data:any)=>{
            joinRoom(socket, data);
        });

        socket.on('send_message', async(message:any) => {
            sendMessage(socket, message);
        });

        socket.on('joinNotifRoom',async(user:any)=>{
            joinNotificationRoom(socket, user);
        })

        socket.on('sendNotification', async(patient:any)=>{
            Notificationsocket(socket, patient);
        })
        
        socket.on('disconnect', ()=>{
            console.log('Client disconnected');
        });
    });
}