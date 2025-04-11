import { useState, useContext, useEffect, useRef } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";

function ChatModal({ receiverId, receiverUsername, receiverAvatar, onClose }) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messagesEndRef = useRef();
  const textareaRef = useRef();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat
  useEffect(() => {
    let isMounted = true; // Add mounted flag to prevent race conditions
    const initializeChat = async () => {
      if (loading === false) return; // Skip if already initialized

      try {
        setLoading(true);
        setError(null);
        console.log("Initializing chat with receiverId:", receiverId);

        if (!receiverId) {
          console.error("No receiver ID available");
          setError(
            "Could not identify the property owner. Please try again later."
          );
          setLoading(false);
          return;
        }

        // Check if chat already exists with this user
        const chatsResponse = await apiRequest.get("/chats");
        console.log("Chats response:", chatsResponse.data);

        if (!isMounted) return; // Don't update state if component unmounted

        const existingChat = chatsResponse.data.find(
          (c) => c.userIDs && c.userIDs.includes(receiverId)
        );
        console.log("Existing chat:", existingChat);

        if (existingChat) {
          // Get existing chat details
          console.log("Getting existing chat details for:", existingChat.id);
          const chatResponse = await apiRequest.get(
            `/chats/${existingChat.id}`
          );
          if (!isMounted) return;
          console.log("Chat details response:", chatResponse.data);
          setChat(chatResponse.data);
          setMessages(chatResponse.data.messages || []);
        } else {
          // Create new chat
          console.log("Creating new chat with:", receiverId);
          const newChatResponse = await apiRequest.post("/chats", {
            receiverId,
          });
          if (!isMounted) return;
          console.log("New chat response:", newChatResponse.data);
          setChat(newChatResponse.data);
          setMessages([]);
        }
        setLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error initializing chat:", error);
        setError("Failed to load chat. Please try again later.");
        setLoading(false);
      }
    };

    if (currentUser && receiverId) {
      initializeChat();
    } else {
      console.log("Missing currentUser or receiverId:", {
        currentUser,
        receiverId,
      });
      if (!currentUser) {
        setError("Please login to chat with the property owner");
      } else if (!receiverId) {
        setError("Could not find the property owner's information");
      }
      setLoading(false);
    }

    return () => {
      isMounted = false; // Clean up
    };
  }, [currentUser, receiverId]);

  // Listen for incoming messages
  useEffect(() => {
    if (socket && chat) {
      socket.on("getMessage", ({ senderId, message, conversationId }) => {
        if (conversationId === chat.id) {
          const newMessage = {
            id: Date.now().toString(), // Temporary ID for new messages
            senderId,
            text: message,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => {
            // Check if message already exists
            const messageExists = prev.some(
              (msg) => msg.text === message && msg.senderId === senderId
            );
            if (messageExists) {
              return prev;
            }
            return [...prev, newMessage];
          });

          // Mark message as read
          apiRequest
            .post(`/chats/read/${chat.id}`)
            .catch((err) =>
              console.error("Error marking message as read:", err)
            );
        }
      });

      // Handle socket reconnection
      socket.io.on("reconnect", () => {
        console.log("ChatModal: Socket reconnected");
      });
    }

    return () => {
      if (socket) {
        socket.off("getMessage");
        socket.io.off("reconnect");
      }
    };
  }, [socket, chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = textareaRef.current.value.trim();

    if (!text || !chat) return;

    try {
      console.log("Sending message to chat:", chat.id);
      const response = await apiRequest.post(`/messages/${chat.id}`, {
        text,
      });
      console.log("Message sent response:", response.data);

      // Extract message data
      const messageData = response.data.message;

      // Add the message to our local state
      setMessages((prev) => [...prev, messageData]);
      textareaRef.current.value = "";

      // Send message via socket
      if (socket) {
        console.log(
          "Emitting sendMessage socket event to receiverId:",
          receiverId
        );
        socket.emit("sendMessage", {
          senderId: currentUser.id,
          receiverId,
          message: text,
          conversationId: chat.id,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleDeleteChat = async () => {
    if (!chat) return;

    // Confirm deletion
    if (
      !window.confirm(
        "Are you sure you want to delete this conversation? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await apiRequest.delete(`/chats/${chat.id}`);
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete conversation. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="chatModal">
        <div className="chatModalContent">
          <div className="chatModalHeader">
            <h3>Chat</h3>
            <button onClick={onClose} className="closeButton">
              ×
            </button>
          </div>
          <div className="loginPrompt">
            <p>Please login to chat with the property owner</p>
            <button onClick={() => (window.location.href = "/login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chatModal">
      <div className="chatModalContent">
        <div className="chatModalHeader">
          <div className="userInfo">
            <img
              src={receiverAvatar || "/default-avatar.png"}
              alt={receiverUsername}
            />
            <h3>{receiverUsername || "Property Owner"}</h3>
          </div>
          <div className="headerButtons">
            <button
              onClick={handleDeleteChat}
              className="deleteButton"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button onClick={onClose} className="closeButton">
              ×
            </button>
          </div>
        </div>

        <div className="chatModalBody">
          {loading ? (
            <div className="loading">Loading chat...</div>
          ) : error ? (
            <div className="errorMessage">{error}</div>
          ) : (
            <>
              <div className="messagesContainer">
                {messages.length === 0 ? (
                  <div className="noMessages">
                    Send a message to start the conversation
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id || index}
                      className={`message ${
                        message.userId === currentUser.id ? "sent" : "received"
                      }`}
                    >
                      <div className="messageContent">
                        <p>{message.text}</p>
                        <span className="messageTime">
                          {message.createdAt
                            ? format(message.createdAt)
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef}></div>
              </div>

              <form onSubmit={handleSubmit} className="messageForm">
                <textarea
                  ref={textareaRef}
                  placeholder="Type your message here..."
                ></textarea>
                <button type="submit"></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
