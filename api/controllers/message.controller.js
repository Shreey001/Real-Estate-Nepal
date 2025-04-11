import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

    // Update the chat with the new lastMessage
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text,
      },
    });

    // Add chatId and lastMessage to the message for socket.io
    message.chatId = chatId;

    // Return enhanced response with both message and lastMessage
    res.status(200).json({
      message,
      chatId,
      lastMessage: text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
