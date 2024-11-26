import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../Styling/Chat.css';
import '../Styling/Dashboard.css'
import { toast } from 'react-toastify';

const socket = io('http://localhost:4000/');

const Chat:React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const chatdata = JSON.parse(localStorage.getItem('chatdata') || '{}')
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const direct = Object.keys(chatdata).length;
    console.log(chatdata);

    useEffect(()=>{
        if(!token){
            navigate('/login');
        }
        socket.emit('joinchat', chatdata);

        socket.on('prev_msg', async(data:any)=>{
            console.log("Old chats", data);
            setMessages([]);
            await data.map((metadata:any)=>{setMessages((prev:any)=>[...prev, metadata])});
        })

        return () => {
            socket.disconnect();
            localStorage.removeItem('chatdata');
        }
    },[])

    useEffect(()=>{
        socket.on('getRoom', (getRoom)=>{
            console.log("Room-id is", getRoom);
        })
    },[])

    useEffect(()=>{
        socket.on("new_message", (data:any)=>{
            setMessages((prev:any) => [...prev, data]);
        })
    },[socket]);


    const sendMessage = async () => {
        if (newMessage.trim() === "") {
            toast.warn("Please Enter Message")
        } else {
            var receiver;
            if(chatdata.user != chatdata.user1){
                receiver = chatdata.user1;
            } else {
                receiver = chatdata.user2;
            }

            const data = {
                sender: chatdata.user,
                message: newMessage.trim(),
                receiver: receiver,
                // room:
            }; 
            socket.emit('send_message', data);
            // console.log(userId1);
            // console.log(userId2);
            setNewMessage('');
        }
    };

  return (
    <>
    { direct != 0 && (
        <div>
            <div className='float-end mb-2'>
                <div className='bg-secondary rounded-top py-1'>
                    <p className='mt-2 mx-3'>Sender</p>
                </div>
                <div className='bg-white rounded-bottom chat-box'>

                </div>
            </div>

            <div className='float-end msg-box d-flex'>
                <input type="text" className='form-control' value={newMessage} onChange={(e)=>{
                    setNewMessage(e.target.value)
                    }} placeholder="Type a message...." />
                    
                    <div className='rounded-circle chng-pointer mx-2 mt-2 ps-1 send-btn' onClick={sendMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send send-icon  " viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                        </svg>
                    </div>
            </div>
        </div>
        
    ) }
    </>
  )
}

export default Chat