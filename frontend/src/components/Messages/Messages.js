import React from 'react';
import './Messages.css';

const Messages = ({ messages }) => (
  <div>
    {messages.map((message, index) => 
        <p className="message" key={index}>{message.text}</p>
      )
    }
  </div>
);

export default Messages;