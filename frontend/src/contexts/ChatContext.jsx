import { createContext, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext.jsx";
import { baseURL } from "../utils/constants.js";
import { io } from "socket.io-client";
import { toast } from "sonner";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token, logoutUser } = useContext(AuthContext);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const socket = useRef();

  async function sendMessage(data) {
    if (socket.current) {
      await socket.current.emit("send_message", data);
    }
  }

  async function updateSeen(data) {
    if (socket.current) {
      await socket.current.emit("update_seen", data);
    }
  }

  useEffect(() => {
    if (token) {
      socket.current = io(baseURL, {
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
      });

      socket.current.on("connect_error", (data) => {
        if (data.message === "unauthorized_connection") {
          logoutUser(true);
        }
      });

      socket.current.on("message", (data) => {
        setIncomingMessage(data);
      });

      socket.current.on("exception", (data) => {
        if (data?.statusCode === 401) {
          logoutUser(true);
        } else {
          const errorMessage = data.message
            ? Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message
            : "An unexpected error occured while sending the message";
          toast(errorMessage);
        }
      });
    }
    return () => {
      socket.current?.disconnect();
    };
  }, [token]);

  let contextData = {
    incomingMessage,
    setIncomingMessage,
    sendMessage,
    updateSeen,
  };

  return (
    <ChatContext.Provider value={contextData}>{children}</ChatContext.Provider>
  );
};

export default ChatContext;
