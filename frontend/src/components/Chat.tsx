import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Local } from "../environment/env";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
// import io from "socket.io-client";
import '../Styling/Dashboard.css';
import "../Styling/Chat.css";
import Socket from "../socket/socketConn";

const socket = Socket;

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  var chatdata = JSON.parse(localStorage.getItem("chatdata") || "{}");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const direct = Object.keys(chatdata).length;
  const pname = localStorage.getItem('pname');
  const [search, setSearch] = useState('');
  const [Input, setInput] = useState('');

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
      socket.off("prev_msg");
    };
  }, []);

  const getRooms = async(search:any) => {
    try{
      const response = await api.get(`${Local.GET_ROOM}?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(err:any){
      toast.error(err.response.data.message)
    }
  }

  // const { data:rooms, error, isLoading, isError } = useQuery({
  //   queryKey: ["rooms"],
  //   queryFn: getRooms
  // })

  const { data:rooms, error, isLoading, isError } = useQuery({
    queryKey: ["rooms", search],
    queryFn: ()=>getRooms(search)
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
  

  const openChat = (patient: any, doc1: any, doc2: any, user: any, pfirstname:string, plastname:string) => {
    const chatData = { patient, user1: doc1, user2: doc2, user };
    localStorage.setItem("chatdata", JSON.stringify(chatData));
    const n = `${pfirstname} ${plastname}`;
    localStorage.setItem("pname", n);
    
    setMessages([]);

    socket.emit("joinchat", chatData);
  };    



console.log("boom-------->", chatdata);

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
  console.log(pname);
  console.log("ssss", messages);
  console.log("------>", rooms);
  return (
    <>
        <div className="chat-layout">
          
          <div className="chat-sidebar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search Patient"
              value={Input}
              onChange={(e:any)=> setInput(e.target.value)}
              onKeyDown={(e:any)=>{
                if(e.key === 'Enter'){
                  setSearch(Input);
                  setInput("");
                }
              }}
            />
            <div className="chat-patient-list">
              {rooms?.room?.map((room:any)=>(
                <>
                  <div className="patient-item active mb-2" onClick={()=>{
                    openChat(room?.patient?.uuid, room?.doc1?.uuid, room?.doc2?.uuid, rooms?.user?.uuid, room?.patient?.firstname, room?.patient?.lastname)
                    }} >
                    <h5>{room.name}</h5>
                    <p>{ room.doc1.uuid != rooms.user.uuid && (
                      <>
                        {room.doc1.firstname} {room.doc1.lastname}
                      </>
                    ) }

                      { room.doc2.uuid != rooms.user.uuid && (
                      <>
                        {room.doc2.firstname} {room.doc2.lastname}
                      </>
                    ) }
                    </p>
                  </div>
                </>
              ))}

            </div>
          </div>

          {direct != 0 && (
            <>

              <div className="chat-main">

                <div className="chat-header">
                  <h4>{pname}</h4>
                </div>

                <div className="chat-messages mb-5">
                  {messages.map((msg: any, index: number) => (
                    <>
                    <div
                      key={index}
                      className={`chat-bubble ${
                        msg.sender_id === chatdata.user
                        ? "chat-sent"
                        : "chat-received"
                        }`}
                        >
                      <p>{msg.message} <br />
                        <span className="msg-time text-secondary" > {msg.createdAt.split('T')[1].split('.')[0].split(':')[0]}:{msg.createdAt.split('T')[1].split('.')[0].split(':')[1]} </span>
                      </p>
                      <span className="message-timestamp"> {msg.createdAt.split("T")[0]} </span>
                    </div>
                    <br />
                    <span id="bottom" ></span>
                    
                      </>
                  ))}
                </div>

                <div className="chat-input-container">
                  <input
                    type="text"
                    className="chat-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e:any) => {
                      if(e.key === "Enter"){
                        document.getElementById('send-msg')?.click();
                      }
                    }}
                  />
                  <button className="chat-send-button" id="send-msg" onClick={sendMessage}>
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
