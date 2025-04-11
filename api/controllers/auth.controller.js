import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user and save it to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "User creation failed",
      error: error.message,
    });
  }
};

//for login

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // If user does not exist
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is incorrect
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const { password: userPassword, ...userInfo } = user;

    // Still set the cookie for backward compatibility
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
    });

    // But focus on returning the token in the response body
    return res.status(200).json({
      user: userInfo,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

//for logout

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.status(200).json({
    message: "Logout successful",
  });
};

// For token validation
export const validate = (req, res) => {
  // First try to get token from cookies
  let token = req.cookies.token;

  // If no cookie token, check for Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });

    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userInfo } = user;
      res.status(200).json({ user: userInfo });
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
};

// For refreshing tokens
export const refresh = (req, res) => {
  // First try to get token from cookies
  let token = req.cookies.token;

  // If no cookie token, check for Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });

    try {
      // Generate a new token
      const newToken = jwt.sign(
        { userId: payload.userId, isAdmin: payload.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      // Set cookie for backward compatibility
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        path: "/",
      });

      // Focus on returning token in body
      return res.status(200).json({
        accessToken: newToken,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      return res.status(500).json({ message: "Failed to refresh token" });
    }
  });
};
