import { create } from "zustand";
import axios from "axios";

export const useMyTasks = create((set, getState) => ({
  myTasks: [],
  fetchMyTasks: async (id) => {
    try {
      set({ myTasks: [] });
      let tasks = [];
      let task = await getState().getTask(id);
      while (task) {
        tasks.push(task);
        task = task.next ? await getState().getTask(task.next) : null;
      }
      set({ myTasks: tasks });
    } catch (error) {
      console.error("Error fetching Tasks:", error);
    }
  },
  getTask: async (id) => {
    try {
      const { data } = await axios.get(`/api/tasks/${id}`);
      return data.data;
    } catch (error) {
      console.error("Error fetching Task:", error);
    }
  },
  deleteMyTask: async (id) => {
    try {
      const task = await getState().getTask(id);
      if (!task) return { success: false, message: "Task not found" };

      const { updateMyTask } = getState(); // Get updateTask from state
      let pTask = task.prev ? await getState().getTask(task.prev) : null;
      let nTask = task.next ? await getState().getTask(task.next) : null;

      // Update the previous and next task pointers
      if (pTask && pTask.next === id) {
        pTask.next = nTask ? nTask._id : null;
      }
      if (nTask && nTask.prev === id) {
        nTask.prev = pTask ? pTask._id : null;
      }

      // Update previous and next tasks if necessary
      if (pTask) {
        const result = await updateMyTask(pTask);
        if (!result.success) return result;
      }
      if (nTask) {
        const result = await updateMyTask(nTask);
        if (!result.success) return result;
      }

      // Remove task from state after deletion
      set((state) => ({
        myTasks: state.myTasks.filter((t) => t._id !== id),
      }));

      return { success: true, message: "Task deleted successfully" };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  },

  updateMyTask: async (task) => {
    try {
      const response = await axios.put(
        `/api/tasks/${task._id}`,
        { task, user: null },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set((state) => ({
          myTasks: state.myTasks.map((t) =>
            t._id === task._id ? response.data.data : t
          ),
        }));
        return { success: true, message: "Task updated successfully" };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to update task",
        };
      }
    } catch (error) {
      console.error("Error updating task:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error updating task",
      };
    }
  },

  restoreTaskLinks: async (id) => {
    try {
      const task = await getState().getTask(id);
      if (!task) {
        console.log("Task not found for restoration.");
        return; // Task not found, so no need to restore
      }

      const pTask = task.prev ? await getState().getTask(task.prev) : null;
      const nTask = task.next ? await getState().getTask(task.next) : null;

      if (pTask && pTask.next === id) pTask.next = task._id;
      if (nTask && nTask.prev === id) nTask.prev = task._id;

      if (pTask) await updateMyTask(pTask);
      if (nTask) await updateMyTask(nTask);

      console.log("Task links restored successfully.");
    } catch (error) {
      console.error("Error restoring task links:", error);
    }
  },
}));