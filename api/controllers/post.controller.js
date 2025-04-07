import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
// Get all posts

export const getPosts = async (req, res) => {
  const query = req.query;
  try {
    // Build search conditions
    let searchConditions = {
      ...(query.type && { type: query.type }),
      ...(query.property && { property: query.property }),
      price: {
        gte: parseInt(query.minPrice) || 0,
        lte: parseInt(query.maxPrice) || 1000000,
      },
      ...(query.size && { size: parseFloat(query.size) }),
      ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
    };

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

    const posts = await prisma.post.findMany({
      where: searchConditions,
      orderBy: {
        createdAt: "desc", // Show newest posts first
      },
    });

    setTimeout(() => {
      res.status(200).json(posts);
    }, 10);
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

    let userId = null;
    const token = req.cookies.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        userId = payload.id;
      } catch (err) {
        console.error("JWT verification error:", err);
        // Keep userId as null if token verification fails
      }
    }

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
