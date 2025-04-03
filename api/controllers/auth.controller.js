import bcrypt from "bcrypt";
import prisma from "/Users/shreejanbhattarai/Real Estate App/api/lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    //create a new user and save it to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);
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
    //check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    //if user does not exist
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    //check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //if password is incorrect
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    //generate a token

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== "development",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "strict",
      })
      .status(200)
      .json({
        user: userInfo,
        token: token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

//for logout

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
};
