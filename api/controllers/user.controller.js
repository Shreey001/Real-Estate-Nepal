import prisma from "../lib/prisma.js";

import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params; // ✅ Correct destructuring

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // Assuming this is a number or stringified number
  const { password, avatar, ...inputs } = req.body;

  if (String(id) !== String(tokenUserId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Hash the password if it exists
  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id }, // ✅ Ensure it's a number
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar: avatar }),
      },
    });

    const { password: userPassword, ...updatedUserWithoutPassword } =
      updatedUser;

    res.status(200).json(updatedUserWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (String(id) !== String(tokenUserId)) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    await prisma.user.delete({
      where: { id: id },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  // Ensure postId is treated as a string
  const postIdString = String(postId);

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId: postIdString,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: { id: savedPost.id },
      });
      res.status(200).json({ message: "Post removed from saved" });
    } else {
      await prisma.savedPost.create({
        data: { userId: tokenUserId, postId: postIdString },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to save post",
      error: error.message,
    });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    // Get user's own posts
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

    // Get saved posts with their full details
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    // Add isSaved=true to saved posts
    const savedPostsData = saved.map((savedPost) => ({
      ...savedPost.post,
      isSaved: true, // Explicitly set isSaved to true for saved posts
    }));

    // Add isSaved=false to user's own posts (unless they're also saved)
    const savedPostIds = new Set(saved.map((sp) => sp.postId));
    const userPostsWithSavedStatus = userPosts.map((post) => ({
      ...post,
      isSaved: savedPostIds.has(post.id),
    }));

    res.status(200).json({
      userPosts: userPostsWithSavedStatus,
      savedPosts: savedPostsData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
        NOT: {
          seenBy: {
            hasSome: [tokenUserId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get notification number" });
  }
};

// Add this new function to get all users for the agents page
export const getAgents = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to be agent-friendly
    const agents = users.map((user) => ({
      id: user.id,
      name: user.username,
      photo: user.avatar || "/default-avatar.png",
      email: user.email,
      listings: user._count.posts,
      role: "Real Estate Agent", // Default role
      experience: Math.floor(Math.random() * 10) + 1, // Random experience between 1-10 years
      location: "Kathmandu", // Default location
      reviews: (Math.random() * (5 - 4) + 4).toFixed(1), // Random rating between 4.0-5.0
      languages: ["English", "Nepali"],
      specialization: "Residential", // Default specialization
      bio: `${user.username} is a dedicated real estate professional with extensive knowledge of the local market. They specialize in helping clients find their perfect property match.`,
      phone: "+977 98XXXXXXXX", // Placeholder phone
      areas: ["Kathmandu", "Lalitpur", "Bhaktapur"],
      achievements: ["Top Listing Agent"],
      joinedDate: user.createdAt,
    }));

    res.status(200).json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Failed to get agents" });
  }
};
