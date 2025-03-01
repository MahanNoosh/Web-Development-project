import { create } from "zustand";
import axios from "axios";
import { useMyTasks } from "./myTask";

export const useTaskFeed = create((set) => ({
  tasks: [],

  createTask: async (newTask) => {
    const { isValidTask } = useTaskFeed.getState();
    if (!newTask.name) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Please enter all the fields correctly",
      };
    }

    try {
      const { data } = await axios.post("/api/tasks", newTask, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      set((state) => ({ tasks: [...state.tasks, data] }));
      return { success: true, message: "Task created successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  },

  fetchTasks: async () => {
    try {
      const { data } = await axios.get("/api/tasks");

      set({ tasks: data.data.filter(task => task.isPublic) });
    } catch (error) {
      console.error("Error fetching Tasks:", error);
    }
  },

  deleteTask: async (id) => {
    try {
      if(!success) return {success, message};
      const { data } = await axios.delete(`/api/tasks/${id}`);
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  },

  updateTask: async (id, updatedTask) => {
    try {
      const { data } = await axios.put(`/api/tasks/${id}`, updatedTask, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        tasks: state.tasks
          .map((task) => (task._id === id ? data.task : task))
          .filter((task) => task.isPublic),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  },
}));
