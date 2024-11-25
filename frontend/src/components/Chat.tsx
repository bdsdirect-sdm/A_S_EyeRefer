import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000/');

const Chat:React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const chatdata = JSON.parse(localStorage.getItem('chatdata')||'')
    console.log(chatdata);

    useEffect(()=>{
        if(!token){
            navigate('/login');
        }
        socket.emit('joinchat', chatdata);
    },[])

  return (
    <div>Chat</div>
  )
}

export default Chat