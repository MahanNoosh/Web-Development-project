import mongoose, { set } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      set: (v) => v.trim().toLowerCase(),
    },
    username: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      unique: true,
      required: true,
      set: (v) => v.trim().toLowerCase(),
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      set: (v) => v.trim().toLowerCase(),
    },
    instagram: {
      type: String,
      unique: true,
      sparse: true,
      set: (v) => (v === "" ? undefined : v),
    },
    discord: {
      type: String,
      unique: true,
      sparse: true,
      set: (v) => (v === "" ? undefined : v),
    },
    linkedin: {
      type: String,
      unique: true,
      sparse: true,
      set: (v) => (v === "" ? undefined : v),
    },
    github: {
      type: String,
      unique: true,
      sparse: true,
      set: (v) => (v === "" ? undefined : v),
    },
    first: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    last: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
