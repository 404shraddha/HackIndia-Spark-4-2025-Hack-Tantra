import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client"; // Import socket.io-client
import {
  Timer,
  MessageSquare,
  Users,
  Brain,
  Award,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { motion } from "framer-motion";

// Message and User interfaces (same as before)
interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  type: "argument" | "rebuttal" | "system";
}

interface User {
  id: string;
  name: string;
  isPro: boolean;
}

function DebateRoom() {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [currentTurn, setCurrentTurn] = useState<"pro" | "con">("pro");
  const [users, setUsers] = useState<User[]>([]); // Dynamic users
  const [socket, setSocket] = useState<any>(null); // State for socket connection

  useEffect(() => {
    // Fetch messages from localStorage if available
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    // Establish socket connection when the component mounts
    const socketConnection = io("http://localhost:5173"); // Connect to your server

    // Listen for messages and users from the server
    socketConnection.on("message", (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          user: "System",
          content: message,
          timestamp: new Date().toISOString(),
          type: "system",
        },
      ]);
    });

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

    // Set the socket connection state
    setSocket(socketConnection);

    // Cleanup the socket connection on unmount
    return () => {
      socketConnection.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // Simulate fetching logged-in user data (replace with actual authentication logic)
    const fetchUsers = async () => {
      // Example: Assume this comes from an authenticated session or an API call
      const loggedInUsers = [
        { id: "1", name: "Alice", isPro: true },
        { id: "2", name: "Bob", isPro: false },
      ];
      console.log(loggedInUsers);
      setUsers(loggedInUsers); // Set users dynamically
    };

    fetchUsers(); // Fetch logged-in users

    // Timer logic to count down the debate time
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: currentTurn === "pro" ? users[0].name : users[1].name,
      content: input,
      timestamp: new Date().toISOString(),
      type: currentTurn === "pro" ? "argument" : "rebuttal",
    };

    // Add the new message to the state
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];

      // Save messages to localStorage
      localStorage.setItem("messages", JSON.stringify(updatedMessages));

      return updatedMessages; // Return the updated array to set state
    });

    setInput("");
    setCurrentTurn(currentTurn === "pro" ? "con" : "pro");

    // Emit the message to the room via socket
    if (socket) {
      socket.emit("send_message", { room: id, message: input });
    }
  };

  const handleJoinDebate = () => {
    if (socket) {
      socket.emit("join_debate", id); // Join the specific debate room
      console.log(`Joined debate room: ${id}`);
    }
  };

  const handleClearMessages = () => {
    setMessages([]); // Clear the messages in state
    localStorage.removeItem("messages"); // Remove messages from localStorage
  };

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      {/* Add the button to join debate */}
      <button onClick={handleJoinDebate} className="arcade-button-lg mb-4">
        Join Debate
      </button>

      <div className="flex justify-center">
        <button
          onClick={handleClearMessages}
          className="px-3 py-1 text-xs arcade-button-sm mb-2 w-24"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Main Debate Area */}
        <div className="flex-1 flex flex-col">
          {/* Debate Info Header */}
          <div className="bg-black/30 p-4 border-b border-white/10">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Timer className="w-5 h-5 text-emerald-400" />
                <span className="font-press-start text-xl">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="font-press-start">2/2</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="container mx-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${
                    message.type === "system"
                      ? "justify-center"
                      : "justify-start"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    {message.type === "argument" ? (
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Brain className="w-4 h-4 text-emerald-400" />
                    )}
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

          {/* Input Area */}
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
                <button type="submit" className="arcade-button-sm">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-black/30 border-l border-white/10 p-4 hidden lg:block">
          <div className="space-y-6">
            {/* Participants Section */}
            <div>
              <h3 className="font-press-start text-sm mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Participants
              </h3>
              <div className="glass-panel p-4 space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-2">
                    <Brain
                      className={`w-4 h-4 ${
                        user.isPro ? "text-purple-500" : "text-emerald-400"
                      }`}
                    />
                    <span className="text-sm">
                      {user.name} {user.isPro ? "(Pro)" : "(Con)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Votes */}
            <div>
              <h3 className="font-press-start text-sm mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                Audience Votes
              </h3>
              <div className="glass-panel p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">100</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                  <span className="text-sm">25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;
