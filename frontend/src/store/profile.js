import { create } from "zustand";
import axios from "axios";

export const useProfile = create((set, get) => ({
    loggedinUser: null,  

    loginUser: async (loginData) => { 

        if (!loginData.userid || !loginData.password) {
            return { success: false, message: "Please enter both username and password." };
        }

        try {

            const response = await axios.post("/api/users/login", loginData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            set({ loggedinUser: response.data.user });
            return { success: true, message: "Login successful!" };
        } catch (error) {

            const errorMessage = error.response?.data?.message || "Login failed.";
            return { success: false, message: errorMessage };
        }
    },

    fetchProfile: async () => {
        try {
            const response = await axios.get("/api/users/profile", { withCredentials: true });

            set({ loggedinUser: response.data.user });
            return { success: true, message: response?.message || "Login successful!" };
        } catch (error) {

            const errorMessage = error.response?.data?.message || "Error fetching profile.";
            return { success: false, message: errorMessage };
        }
    },

    logoutUser: async () => {
        try {
            await axios.post("/api/users/logout", {}, { withCredentials: true });
            set({ loggedinUser: null});  
        } catch (error) {
            return { success: false, message: error.message || "Something went wrong." };
        }
    },

    updateUser: async (id, newUserData) => {
        try {
            const { data } = await axios.put(`/api/users/${id}`, newUserData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!data?.success) {
                return { success: false, message: data?.message || "Update failed." };
            }
            set({
                loggedinUser: data.data,
            });
            return { success: true, message: data.message, data: data.data };
        } catch (error) {
            return { success: false, message: error.message || "Something went wrong." };
        }
    },

    validData: (data) => {
        return data.userid && data.password;
    },
    deleteUser: async (id) => {
        try {
            const { data } = await axios.delete(`/api/users/${id}`);
            if (!data.success) return { success: false, message: data.message };
            set({ loggedinUser: null });
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Something went wrong." };
        }
    }
}));