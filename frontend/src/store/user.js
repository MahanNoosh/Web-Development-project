import { create } from "zustand";
import axios from "axios";  

export const useUserData = create((set) => ({
    users: [], //can be used to show all users or more...

    createUser: async (newUser) => {
        const { isValidUser } = useUserData.getState();
        if (!isValidUser(newUser)) {
            return { success: false, message: "Please enter all the required fields" };
        }

        try {
            const { data } = await axios.post("/api/users/signup", newUser, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            set((state) => ({ users: [...state.users, data] }));
            return { success: true, message: "Your account has been created successfully" };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Something went wrong." };
        }
    },

    isValidUser: (newUser) => {
        return newUser.name && newUser.username && newUser.email && newUser.password;
    },

    deleteUser: async (id) => {
        try {
            const { data } = await axios.delete(`/api/users/${id}`);
            if (!data.success) return { success: false, message: data.message };
            set((state) => ({ users: state.users.filter((user) => user._id !== id) }));
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Something went wrong." };
        }
    },

    updateUser: async (id, updatedUser) => {
        try {
            const { data } = await axios.put(`/api/users/${id}`, updatedUser, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!data.success) return { success: false, message: data.message };
            set((state) => ({
                users: state.users.map((user) => (user._id === id ? data.data : user)),
            }));
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Something went wrong." };
        }
    },
}));
