import prisma from "/Users/shreejanbhattarai/Real Estate App/api/lib/prisma.js";

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

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  console.log("Delete - Request ID:", id, "Type:", typeof id);
  console.log(
    "Delete - Token User ID:",
    tokenUserId,
    "Type:",
    typeof tokenUserId
  );

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
