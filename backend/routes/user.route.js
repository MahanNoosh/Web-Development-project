import express from "express";
import { createUser, deleteUser, updateUser, loginUser, getProfile, logoutUser, getUser, checkPassword } from "../controllers/user.controller.js";

const uRouter = express.Router();

uRouter.post("/signup", createUser);

uRouter.put("/:id", updateUser);

uRouter.delete("/:id", deleteUser);

uRouter.post("/login", loginUser);

uRouter.get("/profile", getProfile);

uRouter.post("/logout", logoutUser);

uRouter.post("/check-password", checkPassword);

uRouter.get("/:id", getUser);

export default uRouter;