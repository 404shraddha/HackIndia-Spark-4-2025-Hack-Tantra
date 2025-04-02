import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { Timer, MessageSquare, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  type: "argument" | "rebuttal" | "system";
}

const DebateRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(3000);
  const [currentTurn, setCurrentTurn] = useState<"pro" | "con">("pro");
  const [username, setUsername] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [judgmentResult, setJudgmentResult] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setUsername(decoded.name);
    }

    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    const socketConnection = io("http://localhost:5173");

    socketConnection.on(
      "receive_message",
      (data: { message: string; sender: string }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            user: data.sender,
            content: data.message,
            timestamp: new Date().toISOString(),
            type: "argument",
          },
        ]);
      }
    );

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: username,
      content: input,
      timestamp: new Date().toISOString(),
      type: currentTurn === "pro" ? "argument" : "rebuttal",
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setInput("");
    setCurrentTurn(currentTurn === "pro" ? "con" : "pro");

    if (socket) {
      socket.emit("send_message", {
        room: id,
        message: input,
        sender: username,
      });
    }
  };

  const handleJudge = async () => {
    try {
      const response = await fetch("http://localhost:5173/judgment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: id,
        }),
      });

      if (!response.ok) {
        throw new Error("Judgment failed");
      }

      const data = await response.json();
      setJudgmentResult(data.result);
    } catch (error) {
      console.error("Error during judgment:", error);
      setJudgmentResult("Error judging the debate.");
    }
  };

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="bg-black/30 p-4 border-b border-white/10">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Timer className="w-5 h-5 text-emerald-400" />
                <span className="font-press-start text-xl">{timeLeft}</span>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-press-start">{username}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="container mx-auto space-y-4">
              {messages.map((message) => (
                <motion.div key={message.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 max-w-2xl glass-panel p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-press-start text-sm">
                        {message.user}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-black/30 border-t border-white/10 p-4">
            <div className="container mx-auto">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Your ${
                    currentTurn === "pro" ? "argument" : "rebuttal"
                  }...`}
                  className="flex-1 bg-black/30 border border-white/10 rounded px-4 py-2 text-sm"
                />
                <button
                  type="button"
                  className="arcade-button-sm"
                  onClick={handleJudge}
                >
                  Judge
                </button>
                <button type="submit" className="arcade-button-sm">
                  Send
                </button>
              </form>
            </div>
          </div>

          {judgmentResult && (
            <div className="bg-black/30 p-4 mt-4">
              <div className="container mx-auto">
                <h3 className="text-lg text-white">Judgment Result</h3>
                <p className="text-sm text-gray-300">{judgmentResult}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateRoom;
