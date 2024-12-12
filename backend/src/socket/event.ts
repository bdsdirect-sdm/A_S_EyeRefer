import Notification from "../models/Notification";
import User from "../models/User";
import Chat from "../models/Chat";
import Room from "../models/Room";
import { io } from "./socket";
import Patient from "../models/Patient";

export const joinRoom = async(socket:any, data:any) => {
    try{
            // console.log(data);
            const room = await Room.findOne({where:{ user_id_1:data.user1,
                user_id_2:data.user2, patient_id:data.patient }});

            if(room){
                socket.join(`room-${room.uuid}`);
                const chats = await Chat.findAll({where:{room_id:room.uuid}, include:[
                {
                    model:User,
                    as:'sender'
                },
                {
                    model:User,
                    as:'receiver'
                },
                {
                    model:Room,
                    as:'room'
                }],
                order:[['createdAt','ASC']]
            });

                if(chats){
                    io.to(`room-${room.uuid}`).emit('prev_msg', chats);
                    io.to(`room-${room?.uuid}`).emit('getRoom', room.uuid);
                } else {
                    io.to(`room-${room?.uuid}`).emit('getRoom', room.uuid);
                }
            } else {
                const newRoom = await Room.create({name:data.roomname, user_id_1:data.user1,
                    user_id_2:data.user2, patient_id:data.patient});

                socket.join(`room-${newRoom.uuid}`);
                io.to(`room-${newRoom?.uuid}`).emit('getRoom', newRoom.uuid);
            }
    }
    catch(err){
        // console.log(err);
    }
}

export const sendMessage = async(socket:any, message:any) => {
    try{
            const chat = await Chat.create({message: message.message,
                room_id: message.room, sender_id: message.sender,
                receiver_id: message.receiver});

            io.to(`room-${message.room}`).emit('new_message', chat);
    }
    catch(err){
        console.log(err);
    }
}

export const joinNotificationRoom = async(socket:any, user:any) => {
    try{

        socket.join(`room-${user.userId}`);

        const unread = await Notification.count({where:{is_seen:false, notifyto: user.userId}});
        io.to(`room-${user.userId}`).emit('getUnreadCount', unread);
    }
    catch(err){
        console.log(err);
    }
}

export const Notificationsocket = async(socket:any, patient:any) => {
    try{
        var notification: string;
        const getPatient:any = await Patient.findByPk(patient.pId, {include:[
            {
                model: User,
                as: 'referbydoc',
                // attributes:['uuid', 'firstname', 'lastname']
            },
            {
                model: User,
                as: 'refertodoc',
                // attributes:['uuid', 'firstname', 'lastname']
            }
        ]});

        if(patient.code%2 != 0){
            if(patient.code == 1){
                notification = `${getPatient?.firstname} ${getPatient?.lastname} appointment is scheduled with Dr. ${getPatient?.refertodoc.firstname} ${getPatient?.refertodoc.lastname}`;
            } else if (patient.code == 3) {
                notification = `${getPatient?.firstname} ${getPatient?.lastname} appointment is rescheduled with Dr. ${getPatient?.refertodoc.firstname} ${getPatient?.refertodoc.lastname}`;
            } else if (patient.code == 5) {
                notification = `${getPatient?.firstname} ${getPatient?.lastname} referral has been completed by Dr. ${getPatient?.refertodoc.firstname} ${getPatient?.refertodoc.lastname}`;
            } else {
                notification = `${getPatient?.firstname} ${getPatient?.lastname} appointment is cancelled with Dr. ${getPatient?.refertodoc.firstname} ${getPatient?.refertodoc.lastname}`;
            }
            const addNotification = await Notification.create({notification:notification, notifyto: getPatient?.referbydoc.uuid, notifyby:getPatient?.refertodoc.uuid});
            if(addNotification){
                const notifcount = await Notification.count({where: {is_seen: false, notifyto: getPatient?.referbydoc.uuid}});
                io.to(`room-${getPatient?.referbydoc.uuid}`).emit('getNotification', addNotification.notification);
                io.to(`room-${getPatient?.referbydoc.uuid}`).emit('getUnreadCount', notifcount);
            }
        } else{
            if(patient.code == 2){
                notification = `Dr. ${getPatient?.referbydoc.firstname} ${getPatient?.referbydoc.lastname} has referred the patient ${getPatient?.firstname} ${getPatient?.lastname} to you for further consultation.`;
            } else {
                notification = `Dr. ${getPatient?.referbydoc.firstname} ${getPatient?.referbydoc.lastname} update the details of ${getPatient?.firstname} ${getPatient?.lastname}.`;
            }
            const addNotification = await Notification.create({notification:notification, notifyto: getPatient?.refertodoc.uuid, notifyby:getPatient?.referbydoc.uuid})
            if(addNotification){
                const notifcount = await Notification.count({where: {is_seen: false, notifyto: getPatient?.referbydoc.uuid}});
                io.to(`room-${getPatient?.refertodoc.uuid}`).emit('getNotification', addNotification.notification);
                io.to(`room-${getPatient?.refertodoc.uuid}`).emit('getUnreadCount', notifcount);
            }
        }
    }
    catch(err){
        console.log(err);
    }
}


/*

-- patient Id is must for notification

1 => Appointment Scheduled
3 => Appointment ReScheduled
5 => Appointment Completed
7 => Appointment Cancelled
2 => Patient Referred
4 => Update Patient detials 
 */