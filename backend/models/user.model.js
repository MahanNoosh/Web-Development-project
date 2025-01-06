import mongoose from "mongoose";

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
        phone: {
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
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
