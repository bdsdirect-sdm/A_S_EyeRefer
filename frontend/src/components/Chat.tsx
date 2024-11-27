import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import io from "socket.io-client";
import "../Styling/Chat.css";
import '../Styling/Dashboard.css';
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";

const socket = io("http://localhost:4000/");

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const chatdata = JSON.parse(localStorage.getItem("chatdata") || "{}");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const direct = Object.keys(chatdata).length;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    function fetchChats(){

      socket.emit("joinchat", chatdata);
      
      socket.on("prev_msg", async (data: any) => {
        console.log("boom", data);
        setMessages([]);
        await data.map((metadata: any) =>
          setMessages((prev: any) => [...prev, metadata])
      );
    });
  }
  fetchChats();
    
    return () => {
      localStorage.removeItem("chatdata");
      // socket.disconnect();
      socket.off('prev_msg');
    };
  }, []);

  const getRooms = async() => {
    try{
      const response = await api.get(`${Local.GET_ROOM}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response)
      return response;
    }
    catch(err:any){
      toast.error(err.response.data.message)
    }
  }

  const { data:rooms, error, isLoading, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms
  })

  useEffect(() => {
    socket.on("getRoom", (getRoom) => {
      localStorage.setItem("room", getRoom);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("new_message", (data: any) => {
      setMessages((prev: any) => [...prev, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      toast.warn("Please Enter Message");
    } else {
      const receiver =
        chatdata.user !== chatdata.user1 ? chatdata.user1 : chatdata.user2;

      const data = {
        sender: chatdata.user,
        message: newMessage.trim(),
        receiver: receiver,
        room: localStorage.getItem("room"),
      };
      socket.emit("send_message", data);
      setNewMessage("");
    }
  };

  if(isLoading){
    return (
      <>
        <div className='loading-icon'>
            <div className="spinner-border spinner text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className='me-2 fs-2' >Loading...</div>
        </div>
      </>
      )
  }

  if(isError){
    return(
      <>
        <div>Error: {error?.message}</div>
      </>
  )
  }

  console.log("------>", rooms);
  return (
    <>
        <div className="chat-layout">
          {/* Sidebar */}
          <div className="chat-sidebar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search Patient"
            />
            <div className="chat-patient-list">
              <div className="patient-item active">
                <h5>Room name</h5>
                <p>Sujal Anand</p>
              </div>
            </div>
          </div>

          {direct != 0 && (
            <>
            {/* Chatbar */}
              <div className="chat-main">
                {/* Header */}
                <div className="chat-header">
                  <h4>ÍJFF</h4>
                  <p>Referred To: Sujal Anand</p>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                  {messages.map((msg: any, index: number) => (
                    <div
                      key={index}
                      className={`chat-bubble ${
                        msg.sender_id === chatdata.user
                          ? "chat-sent"
                          : "chat-received"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <span className="message-timestamp">19 days ago</span>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="chat-input-container">
                  <input
                    type="text"
                    className="chat-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button className="chat-send-button" onClick={sendMessage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-send"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
  
    </>
  );
};

export default Chat;
