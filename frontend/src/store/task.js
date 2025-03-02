import { create } from "zustand";
import axios from "axios";
import { useMyTasks } from "./myTask";

export const useTaskFeed = create((set) => ({
  tasks: [],

  createTask: async (newTask) => {
    // Validate new task input
    if (!newTask.name) {
      return {
        success: false,
        message: "Please enter all the fields correctly",
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
      set({ tasks: data.data.filter((task) => task.isPublic) });
    } catch (error) {
      console.error("Error fetching Tasks:", error);
    }
  },

  // Helper function to delete the task from DB
  deleteTaskHelper: async (id) => {
    try {
      const { data } = await axios.delete(`/api/tasks/${id}`);
      if (!data.success) {
        return { success: false, message: data.message };
      }
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));
      return { success: true, message: "Task deleted from database successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  },

  // Function to delete a task with validation and chain deletion
  deleteTask: async (id) => {
    try {
      // Step 1: Update task links using deleteMyTask
      const deleteMyTaskResult = await useMyTasks.getState().deleteMyTask(id); // Assuming `deleteMyTask` is in useMyTasks store
      if (!deleteMyTaskResult.success) {
        return { success: false, message: deleteMyTaskResult.message }; // Stop if deleteMyTask fails
      }

      // Step 2: Proceed to delete the task from the database
      const deleteTaskResult = await useTaskFeed.getState().deleteTaskHelper(id); // Call deleteTaskHelper in useTaskFeed
      if (!deleteTaskResult.success) {
        // If deleteTaskHelper fails, restore the task links and do nothing
        await useMyTasks.getState().restoreTaskLinks(id); // Rollback task links changes
        return { success: false, message: deleteTaskResult.message }; // Task not deleted from DB
      }

      // If both operations succeed, return success
      return { success: true, message: "Task deleted from database." };
    
    } catch (error) {
      console.error("Error during task deletion:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong during deletion." };
    }
  },
}));
