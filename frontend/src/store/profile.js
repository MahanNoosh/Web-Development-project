import { create } from "zustand";
import axios from "axios";

export const useProfile = create((set) => ({
    loggedinUser: null,  
    loading: false, 
    error: null, 

    loginUser: async (loginData) => {
        set({ loading: true, error: null });  

        if (!loginData.username || !loginData.password) {
            set({ loading: false, error: "Please enter both username and password." });
            return { success: false, message: "Please enter both username and password." };
        }

        try {

            const response = await axios.post("/api/users/login", loginData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            set({ loggedinUser: response.data.user, loading: false });

            return { success: true, message: "Login successful!" };
        } catch (error) {

            const errorMessage = error.response?.data?.message || "Login failed.";
            set({ loading: false, error: errorMessage });
            return { success: false, message: errorMessage };
        }
    },

    fetchProfile: async () => {
        set({ loading: true, error: null });

        try {
            const response = await axios.get("/api/users/profile", { withCredentials: true });

            set({ loggedinUser: response.data.user, loading: false });
        } catch (error) {

            const errorMessage = error.response?.data?.message || "Error fetching profile.";
            set({ loading: false, error: errorMessage });
        }
    },

    logoutUser: async () => {
        try {
            await axios.post("/api/users/logout", {}, { withCredentials: true });
            set({ loggedinUser: null, loading: false, error: null });  
        } catch (error) {
            set({ error: "Logout failed", loading: false });
        }
    },

    validData: (data) => {
        return data.username && data.password;
    },
}));
