import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { getAIMessage, sendAudioMessage } from "../api/api";
import { marked } from "marked";
import { Divider } from "antd";
import { con, startRecording, stopRecording, playAudio } from "./audio/AudioRecorder";

function ChatWindow() {
  
  const defaultMessage = [{
    role: "assistant",
    content: "Hi, how can I help you today?"
  }];

  const [messages,setMessages] = useState(defaultMessage)
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  const handleSend = async (input) => {
    if (input.trim() !== "") {
      // Set user message
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      setInput("");

      // Call API & set assistant message
      const newMessage = await getAIMessage(input);
      console.log(newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  const toggleRecording = async () => {
    if (!recording) {
      if (!connected) {
        await con();
        setConnected(true);
        console.log("Connected");
      }

      startRecording();
      setRecording(true); // Update recording state to true
    } else {
      setLoading(true);
      const wavAudioBlob = await stopRecording();
      // playAudio(wavAudioBlob);
      const newMessage = await sendAudioMessage(wavAudioBlob);
      console.log(newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setLoading(false);
      setRecording(false); // Update recording state to false
    }
  };

  return (
      <div className="messages-container">
          {messages.map((message, index) => (
              <div key={index} className={`${message.role}-message-container`}>
                  {message.content && (
                      <div className={`message ${message.role}-message`}>
                          <div dangerouslySetInnerHTML={{__html: marked(message.content).replace(/<p>|<\/p>/g, "")}}></div>
                      </div>
                  )}
              </div>
          ))}
          <div ref={messagesEndRef} />
          <div className="input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(input);
                  e.preventDefault();
                }
              }}
              rows="3"
            />
            <button className="send-button" onClick={handleSend}>
              Send
            </button>
            <button className="audio-button" onClick={toggleRecording} disabled={loading}>
              {recording ? "Stop" : "Start"}
            </button>
          </div>
      </div>
);
}

export default ChatWindow;
