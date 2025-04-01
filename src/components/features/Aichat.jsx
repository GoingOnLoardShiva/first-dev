import React, { useState } from "react";
import axios from "axios";
import "./style.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const url = process.env.REACT_APP_HOST_URL;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
  
    try {
      const response = await axios.post(url + "/Aichat", {
        message: input,
      });
  
      if (response.data.reply) {
        setMessages([...newMessages, { text: response.data.reply, sender: "bot" }]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "⚠️ Error: Unable to fetch response", sender: "bot" }]);
    }
  };
  

  return (
    <div className="chat-container">
      <h1>Student AI Chat</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender}>
            {msg.sender === "user" ? "👤" : "🤖"} {msg.text}
          </p>
        ))}
        {loading && <p className="bot">🤖 Typing...</p>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
