import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Button } from "react-bootstrap";

const Chat = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("message", (message) => {
      const serverMessage = "Server: " + message.text;
      setMessages((prevMessages) => [...prevMessages, serverMessage]);
    });

   

    return () => {
      socket.off("newMessage");
      socket.off("message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    // console.log(socket);
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
          />
        </label>
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Chat;
