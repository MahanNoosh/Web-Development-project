import express from "express";
import { createUser, deleteUser, updateUser, loginUser, getProfile, logoutUser } from "../controllers/user.controller.js";

const uRouter = express.Router();

uRouter.post("/signup", createUser);

uRouter.put("/:id", updateUser);

uRouter.delete("/:id", deleteUser);

uRouter.post("/login", loginUser);

uRouter.get("/profile", getProfile);

uRouter.post("/logout", logoutUser);


export default uRouter;