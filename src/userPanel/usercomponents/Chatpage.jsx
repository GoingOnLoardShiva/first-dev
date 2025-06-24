import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import {Avatar} from '@mui/material';


const socket = io('https://bac-end.onrender.com'); // Adjust to your backend URL

export default function ChatPage() {
  const { email_id } = useParams(); // Receiver's email from URL
  const [currentUser, setCurrentUser] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);

  const [follower, setFollower] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  // Replaced process.env.REACT_APP_HOST_URL with hardcoded URL to fix "process is not defined" error
  const url = 'http://127.0.0.1:4000/api/v1'; // Your backend base URL

  // Load current user from localStorage and set state
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);
      setCurrentEmail(user?.user?.[0]?.email_id);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  // Load receiver user info for display
  useEffect(() => {
    if (email_id && url) {
      axios.get(`${url}/user-by-email/${email_id}`)
        .then(res => setFollower(res.data))
        .catch(err => console.error("Failed to load follower info", err));
    }
  }, [email_id, url]);

  useEffect(() => {
    if (!email_id || !currentEmail) return;

  
    socket.emit('goOnline', currentEmail);

    const room = [currentEmail, email_id].sort().join('_');
    socket.emit('joinRoom', { from: currentEmail, to: email_id }); // Pass sender and receiver for marking messages read


    axios.get(`${url}/messages/${currentEmail}/${email_id}`)
      .then(res => {

        const sortedMessages = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sortedMessages);
      })
      .catch(err => console.error("Fetch messages error", err));

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });


    return () => {
      socket.off('receiveMessage');
    };
  }, [currentEmail, email_id, url]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && currentEmail && email_id) {
      const messageData = {
        from: currentEmail,
        to: email_id,
        content: input.trim(),
      };
      socket.emit('sendMessage', messageData);
      // Optimistically add message to UI
      setMessages(prev => [...prev, { ...messageData, timestamp: new Date(), sender: currentEmail, receiver: email_id, read: false }]);
      setInput('');
    }
  };

  return (
    <>
      <style>
        {`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        `}
      </style>
      <div className="flex flex-col h-screen bg-gray-100 font-inter" style={{ paddingTop: '64px' }}>
        <div className="bg-white d-flex gap-3 shadow-md p-4 flex items-center justify-between fixed top-0 w-full max-w-lg mx-auto z-10 rounded-b-xl">
          <Avatar  src={follower.img} className="w-14 h-14" />
          <h3 className="text-xl font-semibold text-gray-800">
            {follower?.user_fName || email_id}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-20 pb-20 mt-4 max-w-lg mx-auto w-full">
          <div className="flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === currentEmail ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl shadow-md break-words ${msg.sender === currentEmail
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-800 rounded-bl-none'
                    }`}
                >
                  {msg.content}
                  <span className="block text-xs opacity-75 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <div className="fixed bottom-0 w-full max-w-lg mx-auto bg-white p-4 shadow-lg flex items-center space-x-2 rounded-t-xl">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

