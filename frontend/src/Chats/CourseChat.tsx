import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from "../variables";
import { useAuth } from "../auth/AuthContext";

interface Message {
  username: string;
  content: string;
  created_at: string;
}

interface Props {
  courseId: string;
}

const CourseChat: React.FC<Props> = ({ courseId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuth();
  const userName = auth.username;
  useEffect(() => {
    socketRef.current = io(BACKEND_URL);

    socketRef.current.emit("join-course-chat", courseId);

    socketRef.current.on("receive-message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    socketRef.current.on("chat-history", (history: Message[]) => {
      console.log("Otrzymano historię czatu:", history);
      setMessages(history);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [courseId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("send-message", {
        courseId,
        content: input,
        username: userName,
      });
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div
        className="messages-list"
        style={{ height: "400px", overflowY: "auto" }}>
        {messages.map((m, index) => (
          <div key={index} className="message-item">
            <strong className="message-user">{m.username}</strong>
            <span className="message-content">{m.content}</span>
            <small className="message-time">
              {new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="chat-form">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz coś..."
        />
        <button type="submit" className="chat-submit-btn">
          Wyślij
        </button>
      </form>
    </div>
  );
};

export default CourseChat;
