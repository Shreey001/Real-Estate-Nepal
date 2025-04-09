import prisma from "/Users/shreejanbhattarai/Real Estate App/api/lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  // Return empty array if no user ID is provided
  if (!tokenUserId) {
    return res.status(200).json([]);
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

      // Skip if receiverId is undefined
      if (!receiverId) {
        console.log("Warning: Could not find receiverId for chat:", chat.id);
        chat.receiver = {
          username: "Unknown User",
          avatar: "/default-avatar.png",
        };
        continue;
      }

      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
      chat.receiver = receiver || {
        id: receiverId,
        username: "Unknown User",
        avatar: "/default-avatar.png",
      };
    }

    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get chats" });
  }
};
//get chat by id

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  // Return error if no user ID is provided
  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Find the other user in the chat (the receiver)
    const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
    if (receiverId) {
      const receiver = await prisma.user.findUnique({
        where: {
          id: receiverId,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      // Add receiver info to the chat response
      chat.receiver = receiver || {
        id: receiverId,
        username: "Unknown User",
      };
    }

    await prisma.chat.update({
      where: { id: req.params.id },
      data: {
        seenBy: {
          push: tokenUserId,
        },
      },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get chat" });
  }
};

//add chat

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;

  // Return error if no user ID is provided
  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create chat" });
  }
};

//read chat
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  // Return error if no user ID is provided
  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to read chat" });
  }
};

//delete chat and its messages
export const deleteChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  // Return error if no user ID is provided
  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // First check if the chat exists and belongs to the user
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found or you don't have permission to delete it",
      });
    }

    // Delete all messages associated with this chat first
    await prisma.message.deleteMany({
      where: {
        chatId: chatId,
      },
    });

    // Then delete the chat itself
    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    res
      .status(200)
      .json({ message: "Chat and all its messages deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete chat" });
  }
};
