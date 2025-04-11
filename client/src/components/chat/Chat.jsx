import { useState, useContext, useEffect, useRef } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { useNotificationStore } from "../../lib/notificationStore";
import { Link } from "react-router-dom";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messagesEndRef = useRef();

  const decrese = useNotificationStore((state) => state.decrese);

  console.log("Chat component received chats:", chats);
  console.log("Current user:", currentUser);

  // Handle empty or undefined chats
  const chatList = Array.isArray(chats) ? chats : [];

  // Process chat list to ensure receiver info is correct
  const processedChatList = chatList.map((chat) => {
    console.log("Processing chat:", chat);
    // If receiver is missing, try to find the other user ID
    if (!chat.receiver && chat.userIDs) {
      const otherUserId = chat.userIDs.find((id) => id !== currentUser?.id);
      console.log("Found other user ID:", otherUserId);
      return {
        ...chat,
        receiver: {
          id: otherUserId,
          username: "User " + otherUserId?.substring(0, 5),
          profilePicture: "/default-avatar.png",
        },
      };
    }
    return chat;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      console.log("Opening chat with id:", id);
      console.log("Receiver info:", receiver);
      const response = await apiRequest.get(`/chats/${id}`);
      console.log("Chat details response:", response.data);

      if (response.data && response.data.messages) {
        // Filter out duplicate messages by creating a map keyed by message ID
        const uniqueMessages = [];
        const messageIds = new Set();

        response.data.messages.forEach((message) => {
          if (!messageIds.has(message.id)) {
            messageIds.add(message.id);
            uniqueMessages.push(message);
          }
        });

        // Sort messages by creation date
        uniqueMessages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        // Update response data with unique messages
        response.data.messages = uniqueMessages;
      }

      if (!response.data.seenBy?.includes(currentUser?.id)) {
        decrese();
      }
      setChat({ ...response.data, receiver });
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text || !chat) return;

    try {
      console.log("Sending message to chat:", chat.id);
      const response = await apiRequest.post(`/messages/${chat.id}`, {
        text,
      });
      console.log("Message sent response:", response.data);

      // Extract the message from the response
      const newMessage = response.data.message || response.data;

      // Check if the message already exists in the chat
      const messageExists = chat.messages.some(
        (msg) => msg.id === (newMessage.id || newMessage)
      );

      if (!messageExists) {
        // Update the chat with the new message
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
          lastMessage: text,
        }));
      }

      e.target.reset();

      if (socket && chat.receiver?.id) {
        console.log("Emitting sendMessage to:", chat.receiver.id);
        socket.emit("sendMessage", {
          senderId: currentUser.id,
          receiverId: chat.receiver.id,
          message: text,
          conversationId: chat.id,
        });
      } else {
        console.error("Missing socket or receiver ID:", {
          socket,
          receiverId: chat.receiver?.id,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id, {});
      } catch (error) {
        console.log(error);
      }
    };

    if (chat && socket) {
      // Listen for new messages
      socket.on("getMessage", ({ senderId, message, conversationId }) => {
        if (chat.id === conversationId) {
          const newMessage = {
            id: Date.now().toString(), // Temporary ID for new messages
            senderId,
            text: message,
            createdAt: new Date().toISOString(),
          };

          setChat((prev) => {
            // Check if message already exists
            const messageExists = prev.messages.some(
              (msg) => msg.text === message && msg.senderId === senderId
            );
            if (messageExists) {
              return prev;
            }
            return {
              ...prev,
              messages: [...prev.messages, newMessage],
              lastMessage: message,
            };
          });
          read();
        }
      });

      // Handle socket reconnection
      socket.io.on("reconnect", () => {
        console.log("Chat component: Socket reconnected");
      });
    }

    return () => {
      if (socket) {
        socket.off("getMessage");
        socket.io.off("reconnect");
      }
    };
  }, [socket, chat]);

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent opening chat when clicking delete

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
      await apiRequest.delete(`/chats/${chatId}`);
      // Remove chat from local state
      const updatedChatList = processedChatList.filter((c) => c.id !== chatId);
      // Force refresh by causing a re-render
      window.location.reload();
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete conversation. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        {processedChatList.length === 0 ? (
          <div className="emptyMessageContainer">
            <div className="noMessages">No messages yet</div>
            <Link to="/" className="browseLinkButton">
              Browse Properties
            </Link>
          </div>
        ) : (
          processedChatList.map((c) => (
            <div
              className="message"
              key={c.id}
              style={{
                backgroundColor:
                  c.seenBy?.includes(currentUser?.id) || chat?.id === c.id
                    ? "white"
                    : "#fecd514e",
              }}
              onClick={() => handleOpenChat(c.id, c.receiver)}
            >
              <img src={c.receiver?.avatar || "/default-avatar.png"} alt="" />
              <div className="messageContent">
                <span>{c.receiver?.username || "Unknown User"}</span>
                {c.lastMessage ? (
                  <p>{c.lastMessage}</p>
                ) : (
                  <p className="noMessagesText">No messages yet</p>
                )}
              </div>
              <button
                className="deleteButton"
                onClick={(e) => handleDeleteChat(c.id, e)}
                disabled={deleting}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={
                  chat.receiver?.avatar ||
                  chat.receiver?.profilePicture ||
                  "/default-avatar.png"
                }
                alt=""
              />
              {chat.receiver?.username || "Unknown User"}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {!chat.messages || chat.messages.length === 0 ? (
              <div className="noMessages">No messages yet</div>
            ) : (
              chat.messages.map((message) => (
                <div
                  className="chatMessage"
                  style={{
                    alignSelf:
                      message.userId === currentUser?.id
                        ? "flex-end"
                        : "flex-start",
                    textAlign:
                      message.userId === currentUser?.id ? "right" : "left",
                    backgroundColor:
                      message.userId === currentUser?.id
                        ? "#fecd514e"
                        : "white",
                  }}
                  key={message.id}
                >
                  <p>{message.text}</p>
                  <span>{format(message.createdAt)}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type your message..."></textarea>
            <button type="submit"></button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
