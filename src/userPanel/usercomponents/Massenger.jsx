import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


// --- Icon Components (Inline SVGs for self-containment and control) ---
const RestoreIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history">
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 18.34" />
    <path d="M12 8v5l3 3" />
  </svg>
);

const FavoriteIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ArchiveIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive">
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);

// --- Socket.io Initialization ---
// Ensure this URL points to your actual backend Socket.io server
const socket = io('http://127.0.0.1:4000');

// --- Avatar Component ---
// A reusable component for displaying user avatars with a placeholder fallback
const Avatar = ({ src, alt, size = '14' }) => (
  <div className={`relative w-${size} h-${size} rounded-full overflow-hidden flex items-center justify-center bg-gray-300 flex-shrink-0`}>
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/${size}x${size}/B0B0B0/FFFFFF?text=${alt ? alt[0].toUpperCase() : '?'}`; }}
      />
    ) : (
      <span className="text-white text-lg font-bold">
        {alt ? alt[0].toUpperCase() : '?'}
      </span>
    )}
  </div>
);

// --- ChatView Component ---
// Renders the active conversation for a selected user
function ChatView({ selectedFollower, currentEmail, url, onBackToList }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // Effect to load messages and set up socket listeners for the specific chat
  useEffect(() => {
    if (!selectedFollower || !currentEmail) return;

    setIsLoadingMessages(true); // Set loading state to true when fetching new chat messages

    // Join the room for this specific chat. This also signals the backend to mark messages as read.
    socket.emit('joinRoom', { from: currentEmail, to: selectedFollower.email_id });

    // Fetch historical messages for the selected chat
    axios.get(`${url}/messages/${currentEmail}/${selectedFollower.email_id}`)
      .then(res => {
        const sortedMessages = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sortedMessages);
      })
      .catch(err => {
        console.error("Error fetching messages:", err);
        setMessages([]); // Clear messages on error
      })
      .finally(() => {
        setIsLoadingMessages(false); // Set loading state to false after fetch completes
      });

    // Listen for incoming messages
    const handleReceiveMessage = (msg) => {
      // Add message if it's for the currently open chat
      if ((msg.sender === selectedFollower.email_id && msg.receiver === currentEmail) ||
        (msg.sender === currentEmail && msg.receiver === selectedFollower.email_id)) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('receiveMessage', handleReceiveMessage);

    // Cleanup: remove the event listener when component unmounts or selectedFollower changes
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [currentEmail, selectedFollower, url]);

  // Effect to scroll to the bottom of the messages list when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = () => {
    if (input.trim() && currentEmail && selectedFollower) {
      const messageData = {
        from: currentEmail,
        to: selectedFollower.email_id,
        content: input.trim(),
      };
      socket.emit('sendMessage', messageData);
      // Optimistically add the message to the UI for immediate display
      setMessages(prev => [...prev, { ...messageData, timestamp: new Date().toISOString(), sender: currentEmail, receiver: selectedFollower.email_id, read: false }]);
      setInput(''); // Clear the input field
    }
  };

  // Determine header and input bar height for padding calculation
  // Tailwind's p-3 is usually 12px. Let's estimate header height based on content + padding
  // A reasonable pt/pb for fixed headers/footers often around 16 (64px) to 20 (80px)
  const headerHeightClass = 'h-16'; // Approximate height of the header
  const inputBarHeightClass = 'h-20'; // Approximate height of the input bar

  return (
    <div style={{ marginTop: "400px" }} className="flex flex-col h-screen bg-white font-sans antialiased max-w-lg mx-auto w-full border-x border-gray-200 shadow-lg">
      {/* Header for the chat view */}
      <div className={`fixed top-0 w-full max-w-lg mx-auto bg-white shadow-md p-3 flex items-center z-20 border-b border-gray-200 ${headerHeightClass}`}>
        <button onClick={onBackToList} className="text-blue-500 hover:text-blue-700 p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center flex-grow justify-center -ml-8"> {/* Adjusted margin for centering */}
          <Avatar src={selectedFollower.img} alt={selectedFollower.user_fName} size="10" />
          <h3 className="text-lg font-semibold text-gray-800 ml-3 truncate">
            {selectedFollower?.user_fName || selectedFollower?.email_id}
          </h3>
        </div>
      </div>

      {/* Message Area - Adjusted padding for fixed header and input bar */}
      <div className={`flex-1 overflow-y-auto p-4 ${headerHeightClass} ${inputBarHeightClass} w-full bg-gray-50`}
        style={{ paddingTop: 'calc(4rem + 1rem)', paddingBottom: 'calc(5rem + 1rem)' }}> {/* Adjusted to clear fixed header and input, pt-16 (64px) for header, pb-20 (80px) for input */}
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            <CircularProgress color="inherit" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === currentEmail ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm break-words relative
                    ${msg.sender === currentEmail
                      ? 'bg-blue-500 text-white rounded-br-md self-end' // Sent message style
                      : 'bg-gray-200 text-gray-900 rounded-bl-md self-start' // Received message style
                    }`}
                >
                  {msg.content}
                  <span className={`block text-xs mt-1 ${msg.sender === currentEmail ? 'text-blue-100' : 'text-gray-600'} text-right opacity-80`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div> {/* Ref for auto-scrolling */}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`fixed bottom-0 w-full max-w-lg mx-auto bg-white p-3 shadow-lg flex items-center space-x-2 border-t border-gray-200 z-20 ${inputBarHeightClass}`}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className="flex-1 p-3 text-gray-800 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-base shadow-sm"
          placeholder="iMessage"
          aria-label="Type your message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// --- Main App Component ---
// Manages the overall application state and conditional rendering of views
export default function App() {
  const [bottomNavValue, setBottomNavValue] = useState(0); // State for bottom navigation
  const [followers, setFollowers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({}); // Map: email_id -> true/false status
  const [unreadCounts, setUnreadCounts] = useState({}); // Map: email_id -> unread message count
  const [currentUser, setCurrentUser] = useState(null); // Current logged-in user object
  const [currentEmail, setCurrentEmail] = useState(null); // Email of the current logged-in user
  const [selectedFollower, setSelectedFollower] = useState(null); // Currently selected follower for chat view
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(true);

  // Replace with your actual backend URL. For production, use environment variables.
  const url = process.env.REACT_APP_HOST_URL;

  // Effect to load current user data from localStorage on app start
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);
      setCurrentEmail(user?.user?.[0]?.email_id);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  // Effect to fetch followers and initial unread counts, and emit online status
  useEffect(() => {
    if (currentEmail) {
      setIsLoadingFollowers(true); // Start loading followers

      // Fetch followers for the current user
      axios.get(`${url}/followers/${currentEmail}`)
        .then(res => setFollowers(res.data))
        .catch(err => {
          console.error("Error fetching followers:", err);
          setFollowers([]); // Ensure followers is an empty array on error
        })
        .finally(() => setIsLoadingFollowers(false)); // End loading followers

      // Fetch initial unread message counts
      axios.get(`${url}/unreadcontnents/${currentEmail}`)
        .then(res => {
          const counts = {};
          res.data.forEach(item => {
            counts[item.sender] = item.count;
          });
          setUnreadCounts(counts);
        })
        .catch(err => console.error("Error fetching unread counts:", err));

      // Inform the server that the current user is online
      socket.emit('goOnline', currentEmail);
    }
  }, [currentEmail, url]);

  // Effect to set up Socket.io listeners for real-time updates
  useEffect(() => {
    // Listener for when a user comes online
    const handleUserOnline = (emailId) => {
      setOnlineUsers(prev => ({ ...prev, [emailId]: true }));
      console.log(`${emailId} is now online.`);
    };
    socket.on('userOnline', handleUserOnline);

    // Listener for when a user goes offline
    const handleUserOffline = (emailId) => {
      setOnlineUsers(prev => ({ ...prev, [emailId]: false }));
      console.log(`${emailId} is now offline.`);
    };
    socket.on('userOffline', handleUserOffline);

    // Listener for new messages to update unread counts
    const handleReceiveMessage = (message) => {
      // If the message is intended for the current user and not sent by the current user
      if (message.receiver === currentEmail && message.sender !== currentEmail) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1 // Increment unread count
        }));
        // If the chat with this sender is currently open, immediately mark messages as read
        if (selectedFollower && selectedFollower.email_id === message.sender) {
          socket.emit('markMessagesRead', { sender: message.sender, receiver: currentEmail });
        }
      }
    };
    socket.on('receiveMessage', handleReceiveMessage);

    // Listener for when messages are marked as read by the other party
    const handleMessagesRead = ({ sender, receiver }) => {
      // If the current user is the receiver of the read messages (i.e., your messages were read)
      if (receiver === currentEmail) {
        setUnreadCounts(prev => ({
          ...prev,
          [sender]: 0 // Reset unread count for that conversation
        }));
      }
    };
    socket.on('messagesRead', handleMessagesRead);

    // Cleanup function: remove all event listeners when the component unmounts
    return () => {
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [currentEmail, selectedFollower]); // Dependencies include currentEmail and selectedFollower

  // Handler for when a follower is clicked from the list
  const handleChatStart = (follower) => {
    setSelectedFollower(follower); // Set the selected follower to display the chat view
    setUnreadCounts(prev => ({ ...prev, [follower.email_id]: 0 })); // Optimistically clear unread count
    // Emit event to server to mark messages from this follower as read
    if (currentEmail && follower.email_id) {
      socket.emit('markMessagesRead', { sender: follower.email_id, receiver: currentEmail });
    }
  };

  // Handler to go back to the follower list from the chat view
  const handleBackToList = () => {
    setSelectedFollower(null); // Clear the selected follower, which shows the list
  };

  // Determine header and bottom nav height for padding calculation
  // Tailwind's p-4 is usually 16px, p-3 is 12px.
  // The header for the follower list has p-4. The bottom nav has p-3.
  const followerListHeaderHeightClass = 'h-16'; // Roughly 64px for top header
  const bottomNavHeightClass = 'h-20'; // Roughly 80px for bottom navigation (including content)


  return (
    < >
      {/* Link to Tailwind CSS framework */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      {/* Custom styles for animations and font */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes bounceIn {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
        }
        .animate-bounce-in {
            animation: bounceIn 0.5s ease-out;
        }
        `}
      </style>

      {/* Main container for the application */}
      <div style={{ paddingTop: "100px" }} className="flex flex-col min-h-screen bg-gray-100 font-inter w-full max-w-lg mx-auto rounded-lg shadow-lg">
        {selectedFollower ? (
          // If a follower is selected, render the ChatView component (the "second page" merged)
          <ChatView
            style={{ paddingTop: "50px" }}
            selectedFollower={selectedFollower}
            currentEmail={currentEmail}
            url={url}
            onBackToList={handleBackToList}
          />
        ) : (
          // Otherwise, render the follower list and bottom navigation (the "first page")
          <>
            {/* Header for the follower list */}
            <div style={{ marginTop: "50px" }} className={`fixed top-0 w-full max-w-lg mx-auto bg-white shadow-sm p-4 flex justify-center items-center z-10 border-b border-gray-200 ${followerListHeaderHeightClass}`}>
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            </div>

            {/* Follower List Area - Adjusted padding for fixed header and bottom navigation */}
            <div className={`flex-1 overflow-y-auto p-2 ${followerListHeaderHeightClass} ${bottomNavHeightClass} w-full max-w-lg mx-auto bg-white`}
              style={{ paddingTop: "50px" }} > {/* Adjusted to clear fixed header and bottom nav */}
              <ul className="list-none p-0 m-0">
                {isLoadingFollowers ? (
                  <div className="text-center text-gray-500 p-8"> <CircularProgress color="inherit" /></div>
                ) : followers.length === 0 ? (
                  <div className="text-center text-gray-500 p-8">No followers found.</div>
                ) : (
                  followers.map((follower, index) => {
                    const isOnline = onlineUsers[follower.email_id];
                    const unreadCount = unreadCounts[follower.email_id] || 0;
                    return (
                      <li
                        key={index}
                        onClick={() => handleChatStart(follower)}
                        className="flex items-center p-3 my-2 bg-white rounded-xl shadow-sm cursor-pointer
                                   hover:bg-gray-50 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                      >
                        <div className="relative mr-4">
                          <Avatar src={follower.img} alt={follower.user_fName} size="14" />
                          {isOnline && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-500 transform translate-x-1 translate-y-1"></span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-lg text-gray-800 truncate">{follower.user_fName}</p>
                          <p className="text-sm text-gray-600">
                            {isOnline ? 'Online' : 'Offline'}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce-in min-w-[28px] text-center flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            {/* Bottom Navigation */}
            <div className={`fixed bottom-0 w-full max-w-lg mx-auto bg-white shadow-lg flex justify-around items-center p-3 z-10 rounded-t-xl border-t border-gray-200 ${bottomNavHeightClass}`}>
              <button
                onClick={() => setBottomNavValue(0)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${bottomNavValue === 0 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <RestoreIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Recents</span>
              </button>
              <button
                onClick={() => setBottomNavValue(1)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${bottomNavValue === 1 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FavoriteIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Favorites</span>
              </button>
              <button
                onClick={() => setBottomNavValue(2)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${bottomNavValue === 2 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ArchiveIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Archive</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
