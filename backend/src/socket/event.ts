import { Response } from "express";
import User from "../models/User";
import Chat from "../models/Chat";
import Room from "../models/Room";

export const joinRoom = async(socket:any, data:any) => {
    try{
            console.log(data);
            const room = await Room.findOne({where:{ user_id_1:data.user1,
                user_id_2:data.user2, patient_id:data.patient }});

            if(room){
                socket.join(`room-${room.uuid}`);
                const chats = await Chat.findAll({where:{roomId:data.room}});

                if(chats){
                    socket.to(`room-${room.uuid}`).emit('prev_msg', chats);
                }
            } else {
                const newRoom = await Room.create({name:data.roomname, user_id_1:data.user1,
                    user_id_2:data.user2, patient_id:data.patient});

                socket.join(`room-${newRoom.uuid}`);
            }
    }
    catch(err){
        console.log(err);
    }
}

export const sendMessage = async(socket:any, message:any) => {
    try{
            const chat = await Chat.create({message: message.message,
                room_id: message.room, sender_id: message.sender,
                receiver_id: message.receiver});

            socket.to(`room-${message.room}`).emit('new_message', chat);
    }
    catch(err){
        console.log(err);
    }
}