import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  BottomNavigation, BottomNavigationAction, Box, CssBaseline,
  Paper, List, ListItemButton, ListItemAvatar, ListItemText, Avatar
} from '@mui/material';

// Using inline SVG icons to avoid external module resolution issues
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



const socket = io('http://127.0.0.1:4000',);

export default function Massenger() {
  const [value, setValue] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({}); // Map: email_id -> true/false
  const [unreadCounts, setUnreadCounts] = useState({}); // Map: email_id -> count
  const navigate = useNavigate();
  // Replaced process.env.REACT_APP_HOST_URL with hardcoded URL to fix "process is not defined" error
  const url = 'http://127.0.0.1:4000/api/v1';
  const [currentUser, setCurrentUser] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [uid, setUid] = useState(null);

  // Load current user from localStorage and set state
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);
      setCurrentEmail(user?.user?.[0]?.email_id);
      setUid(user?.secureUID);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  // Fetch followers and unread counts
  useEffect(() => {
    if (currentEmail) {
      // Fetch followers
      axios.get(`${url}/followers/${currentEmail}`)
        .then(res => setFollowers(res.data))
        .catch(err => console.error("Error fetching followers", err));

      axios.get(`${url}/unreadcontnents/${currentEmail}`)
        .then(res => {
          const counts = {};
          res.data.forEach(item => {
            counts[item.sender] = item.count;
          });
          setUnreadCounts(counts);
        })
        .catch(err => console.error("Error fetching unread counts", err));
      // Emit online status
      socket.emit('goOnline', currentEmail);
    }
  }, [currentEmail, url]);

  // Socket.io listeners for online/offline status and message updates
  useEffect(() => {
    // Listen for users going online
    socket.on('userOnline', (emailId) => {
      setOnlineUsers(prev => ({ ...prev, [emailId]: true }));
      console.log(`${emailId} is now online.`);
    });

    // Listen for users going offline
    socket.on('userOffline', (emailId) => {
      setOnlineUsers(prev => ({ ...prev, [emailId]: false }));
      console.log(`${emailId} is now offline.`);
    });

    // Listen for new messages to update unread counts
    socket.on('receiveMessage', (message) => {
      // If the message is for the current user and not from the current user
      if (message.receiver === currentEmail && message.sender !== currentEmail) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1
        }));
      }
    });

    // Listen for messages being marked as read (when the other user opens the chat)
    socket.on('messagesRead', ({ sender, receiver }) => {
      // If the current user is the sender of the messages that were read
      if (sender === currentEmail) {
        setUnreadCounts(prev => ({
          ...prev,
          [receiver]: 0 // Reset unread count for that chat
        }));
      }
    });


    // Clean up socket listeners
    return () => {
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('receiveMessage');
      socket.off('messagesRead');
    };
  }, [currentEmail]);

  const handleChatStart = (follower) => {
    if (!uid) {
      console.error("UID not found. Cannot navigate.");
      return;
    }
    navigate(`/user/${uid}/chat/${follower.email_id}`, {
      state: { follower },
    });
    // Reset unread count for this follower when navigating to chat
    setUnreadCounts(prev => ({ ...prev, [follower.email_id]: 0 }));
  };

  return (
    <>
      <style>
        {`
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
      <div className="flex flex-col min-h-screen bg-gray-100 font-inter">
        {/* Header with App Logo */}
        <div className="fixed top-0 w-full max-w-lg mx-auto bg-white shadow-md p-4 flex justify-center items-center z-10 rounded-b-xl">
          {/* <img src={window.location.origin + "/lovea.gif"} style={} alt="logo" className="h-10" /> */}
        </div>

        {/* Main Content Area: Follower List */}
        <Box sx={{ width: "100%", maxWidth: "500px", mx: "auto", mt: "70px", mb: "70px" }}>
          <CssBaseline />
          <List>
            {followers.map((follower, index) => {
              const isOnline = onlineUsers[follower.email_id];
              const unreadCount = unreadCounts[follower.email_id] || 0;
              return (
                <ListItemButton
                  key={index}
                  onClick={() => handleChatStart(follower)}
                  className="hover:bg-gray-100 transition duration-200 ease-in-out transform hover:scale-105 rounded-lg my-2 mx-2 p-3"
                >
                  <ListItemAvatar className="relative">
                    <Avatar alt={follower.user_fName} src={follower.img} className="w-14 h-14" />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-green-500 transform translate-x-1 translate-y-1"></span>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span className="font-semibold text-lg text-gray-800">
                        {follower.user_fName}
                      </span>
                    }
                    secondary={
                      <span className="text-gray-600">
                        {isOnline ? 'Online' : 'Offline'}
                      </span>
                    }
                    className="ml-4"
                  />
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce-in">
                      {unreadCount}
                    </span>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Bottom Navigation */}
        <Paper sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: "100%",
          maxWidth: "500px",
          zIndex: 1300,
          borderRadius: '16px 16px 0 0', // Rounded top corners
        }} elevation={5}>
          <BottomNavigation value={value} onChange={(event, newValue) => setValue(newValue)} showLabels>
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Archive" icon={<ArchiveIcon />} />
          </BottomNavigation>
        </Paper>
      </div>
    </>
  );
}
