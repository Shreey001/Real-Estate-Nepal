import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
// Get all posts

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log('Incoming query parameters:', query);
  const userId = req.userId; // From verifyToken middleware

  try {
    // Build search conditions - return all posts if no query parameters
    let searchConditions = {};
    
    // Only apply filters if specific filter parameters exist
    if (query.type || query.property || query.minPrice || query.maxPrice || query.size || query.bedroom) {
      searchConditions = {
        ...(query.type && { type: query.type }),
        ...(query.property && { property: query.property }),
        ...(query.minPrice || query.maxPrice ? {
          price: {
            gte: parseInt(query.minPrice) || 0,
            lte: parseInt(query.maxPrice) || 1000000,
          }
        } : {}),
        ...(query.size && { size: parseFloat(query.size) }),
        ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
      };
    }

    // Add search term condition that searches both city and location
    if (query.searchTerm) {
      searchConditions = {
        ...searchConditions,
        OR: [
          { city: { contains: query.searchTerm, mode: "insensitive" } },
          { location: { contains: query.searchTerm, mode: "insensitive" } },
          { address: { contains: query.searchTerm, mode: "insensitive" } },
        ],
      };
    }

    // Get all posts
    console.log("Search conditions:", JSON.stringify(searchConditions, null, 2));
    const posts = await prisma.post.findMany({
      where: searchConditions,
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("Fetched posts count:", posts.length);

    // If user is authenticated, get their saved posts
    let savedPostIds = new Set();
    if (userId) {
      const savedPosts = await prisma.savedPost.findMany({
        where: {
          userId: userId,
        },
        select: {
          postId: true,
        },
      });
      savedPostIds = new Set(savedPosts.map((sp) => sp.postId));
    }

    // Add isSaved field to each post
    const postsWithSavedStatus = posts.map((post) => ({
      ...post,
      isSaved: savedPostIds.has(post.id),
    }));

    res.status(200).json(postsWithSavedStatus);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get a single post

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get user ID from verified token (set by verifyToken middleware)
    const userId = req.userId;

    let isSaved = false;
    if (userId) {
      const savedPost = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: id,
          },
        },
      });
      isSaved = !!savedPost;
    }

    res.status(200).json({ ...post, isSaved });
  } catch (error) {
    console.error("Error in getPost:", error);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Add a new post

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add post" });
  }
};

// Update a post

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId;
  const body = req.body;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedPost = await prisma.post.update({
      where: { id },
      data: body,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

// Delete a post

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
