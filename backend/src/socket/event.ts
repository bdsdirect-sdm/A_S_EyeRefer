import { Response } from "express";
import User from "../models/User";
import Chat from "../models/Chat";
import Room from "../models/Room";
import { io } from "..";

export const joinRoom = (socket:any) => {
    try{
        let roomid;
        socket.on('joinchat', async(data:any)=>{
            console.log(data);
            // const room = await Room.findOne({where:{ user_id_1:data.user1,
            //     user_id_2:data.user2, patient_id:data.patient }});

            // if(room){
            //     socket.join(`room-${room.uuid}`);
            //     const chats = await Chat.findAll({where:{roomId:data.room}});

            //     if(chats){
            //         io.to(`room-${room.uuid}`).emit('prev_msg', chats);
            //     }
            // } else {
            //     const newRoom = await Room.create({user_id_1:data.user1,
            //         user_id_2:data.user2, patient_id:data.patient});

            //     socket.join(`room-${newRoom.uuid}`);
            // }
        })
    }
    catch(err){
        console.log(err);
    }
}

export const sendMessage = (socket:any) => {
    try{
        socket.on('send_messsage', async(message:any) => {
            const chat = await Chat.create({message: message.message,
                room_id: message.room, sender_id: message.sender,
                receiver_id: message.receiver});

            io.to(`room-${message.room}`).emit('new_message', chat);
        })
    }
    catch(err){
        console.log(err);
    }
}