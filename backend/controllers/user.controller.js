import User from "../models/user.model.js";
import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../password/hash.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const user = req.body;
  if (!isValidUser(user)) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all required fields" });
  }
  user.password = await hashPassword(user.password);
  const newUser = new User(user);
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const isValidUser = (user) => {
  return user.name && user.username && user.password && user.email;
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const newUserData = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user = await User.findById(id);
    const updateFields = {};
    const unsetFields = {};
    // Check if the password is being updated
    if (newUserData.password && newUserData.password !== user.password) {
      newUserData.password = await hashPassword(newUserData.password);
    } else {
      newUserData.password = user.password;
    }

    Object.keys(newUserData).forEach((key) => {
      if (newUserData[key] === "") {
        unsetFields[key] = ""; // Use $unset to remove the field
      } else {
        updateFields[key] = newUserData[key];
      }
    });

    const updateOps = {
      ...updateFields,
      ...(Object.keys(unsetFields).length > 0 ? { $unset: unsetFields } : {}),
    };

    const updatedUser = await User.findByIdAndUpdate(id, updateOps, {
      new: true,
    });
    return res
      .status(200)
      .json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  try {
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userid, password } = req.body;
    const user = await User.findOne({ userid });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!(await comparePassword(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong password" });
    }
    jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token)
          .json({ success: true, message: "Logged in successfully", user });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};

export const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ userid: id });
    if (!user) {
      return res
        .status(200)
        .json({
          success: false,
          message: "User not found",
          data: {
            username: "Deleted user",
            linkedin: "",
            instagram: "",
            github: "",
            discord: "",
            email: "",
          },
        });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "User fetched successfully",
        data: {
          username: user.username,
          linkedin: user.linkedin,
          instagram: user.instagram,
          github: user.github,
          discord: user.discord,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkPassword = async (req, res) => {
  const { password1, password2 } = req.body;
  try {
    if (!(await comparePassword(password1, password2))) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong password" });
    }
    res.status(200).json({ success: true, message: "Password is correct" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
