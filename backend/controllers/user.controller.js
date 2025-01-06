import User from "../models/user.model.js";
import mongoose from "mongoose";

import jwt from 'jsonwebtoken';

export const createUser = async (req, res)=>{
    const user = req.body;
    if (!isValidUser(user)) {
        return res.status(400).json({succsess: false, message: "Please enter all required fields"})
    }
    const newUser = new User(user)
    try {
        await newUser.save();
        res.status(201).json({success: true, data: newUser})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({success: false, message: "User already exists"})
        }
        res.status(500).json({success: false, "message": "Server error"})
    }
}

const isValidUser = (user) => {
    return user.name && user.username && user.password && user.email;
}

export const updateUser = async (req, res)=>{
    const {id} = req.params;
    const user = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({succsess: false, message: "User not found"})
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new: true});
        res.status(200).json({success: true, data: updatedUser})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}

export const deleteUser = async (req, res)=>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({succsess: false, message: "User not found"})
    }
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "User deleted successfully"})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Wrong password" });
        }
        jwt.sign({ username: user.username, id: user._id}, process.env.JWT_SECRET,{},(err, token)=>{
            if (err) throw err;
            res.cookie("token", token).json({ success: true, message: "Logged in successfully", user });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const logoutUser = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during logout" });
    }
};

export const getProfile = async (req, res) => {
    const {token} = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "Profile fetched successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}