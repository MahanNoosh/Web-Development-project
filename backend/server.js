import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import taskRoutes from "./routes/task.route.js";
import userRouters from "./routes/user.route.js";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2450;

app.use(express.json());
const __dirname = path.resolve();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouters);
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at https://localhost:${PORT}`);
});
