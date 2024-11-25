import express from 'express';
import cors from 'cors';
import { Local } from './environment/env';
import sequelize from './config/db';
import userRouter from './routers/userRouter';
import User from './models/User';
import Chat from "./models/Chat";
import Room from "./models/Room";
import {createServer} from 'http';
import { setSocket } from './socket/socket';
// import sequelize from 'seq';

const app = express();

export const httpServer = createServer(app);
setSocket(httpServer)


app.use(cors());
app.use(express.json());
app.use("/", userRouter);



// io.on('connection', (socket) => {
//     console.log('Client connected');
//     let roomid;
    
//     socket.on('joinchat', async(data:any)=>{
//         console.log(data);
//             // const room = await Room.findOne({where:{ user_id_1:data.user1,
//             //     user_id_2:data.user2, patient_id:data.patient }});

//             // if(room){
//             //     socket.join(`room-${room.uuid}`);
//             //     const chats = await Chat.findAll({where:{roomId:data.room}});

//             //     if(chats){
//             //         io.to(`room-${room.uuid}`).emit('prev_msg', chats);
//             //     }
//             // } else {
//             //     const newRoom = await Room.create({user_id_1:data.user1,
//             //         user_id_2:data.user2, patient_id:data.patient});

//             //     socket.join(`room-${newRoom.uuid}`);
//             // }
//         })

//         socket.on('send_messsage', async(message:any) => {
//             console.log(message)
//             // const chat = await Chat.create({message: message.message,
//             //     room_id: message.room, sender_id: message.sender,
//             //     receiver_id: message.receiver});

//             // io.to(`room-${message.room}`).emit('new_message', chat);
//         })

//     socket.on('disconnect', ()=>{
//         console.log('Client disconnected');
//     });
// });






sequelize.sync().then(()=>{
    console.log('Database connected');
    
    httpServer.listen(Local.SERVER_PORT,  () => {
        console.log(`Server is running on port ${Local.SERVER_PORT}`);
        });
}).catch((err)=>{
    console.log("Error: ", err);
})