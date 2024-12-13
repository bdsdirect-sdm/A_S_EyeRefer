import {Server} from 'socket.io'
import { joinRoom, sendMessage, joinNotificationRoom, Notificationsocket, sendCount } from './event'

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
            await joinRoom(socket, data);
        });

        socket.on('send_message', async(message:any) => {
            await sendMessage(socket, message);
        });

        socket.on('joinNotifRoom',async(user:any)=>{
            await joinNotificationRoom(socket, user);
        })

        socket.on('sendNotification', async(patient:any)=>{
            await Notificationsocket(socket, patient);
        })

        // socket.on('setCount', (userId:any)=>{
        //     console.log("llllllll--------->   ", userId);
        //     sendCount(userId, 0);
        // })
        
        socket.on('disconnect', ()=>{
            console.log('Client disconnected');
        });
    });
}