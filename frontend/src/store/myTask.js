import { create } from "zustand";
import axios from "axios";

export const useMyTasks = create((set, getState) => ({
  myTasks: [],

  fetchMyTasks: async (firstTaskId) => {
    try {
      // Clear previous tasks
      set({ myTasks: [] });

      // Fetch all tasks for the user starting from the first task
      const response = await axios.get(`/api/tasks/loadll/${firstTaskId}`);
      if (response.data.success) {
        set({ myTasks: response.data.data });
      } else {
        console.error("Error fetching tasks:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
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

      const { updateTaskHelper } = getState(); // Get updateTask from state
      let pTask = task.prev ? await getState().getTask(task.prev) : null;
      let nTask = task.next ? await getState().getTask(task.next) : null;
      let firstTask = null;
      let lastTask = null;
      let isEmpty = false;
      // Update the previous and next task pointers
      if (pTask && pTask.next === id) {
        pTask.next = nTask ? nTask._id : null;
        lastTask = pTask;
      }
      if (nTask && nTask.prev === id) {
        nTask.prev = pTask ? pTask._id : null;
        firstTask = nTask;
      }

      // Update previous and next tasks if necessary
      if (!pTask && !nTask) {
        isEmpty = true;
      }
      if (pTask) {
        const result = await updateTaskHelper(pTask);
        if (!result.success) return result;
      }
      if (nTask) {
        const result = await updateTaskHelper(nTask);
        if (!result.success) return result;
      }

      // Remove task from state after deletion
      set((state) => ({
        myTasks: state.myTasks.filter((t) => t._id !== id),
      }));

      return {
        success: true,
        message: "Task deleted successfully",
        isEmpty: isEmpty,
        head: firstTask ? firstTask : null,
        tail: lastTask ? lastTask : null,
      };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  },

  updateTaskHelper: async (task) => {
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

  updateMyTasks: async (task) => {
    try {
      set((state) => ({
        myTasks: state.myTasks.map((t) => (t._id === task._id ? task : t)),
      }));
      return { success: true, message: "Tasks updated successfully" };
    } catch (error) {
      console.error("Error updating my tasks:", error);
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

      if (pTask) await updateTaskHelper(pTask);
      if (nTask) await updateTaskHelper(nTask);

      console.log("Task links restored successfully.");
    } catch (error) {
      console.error("Error restoring task links:", error);
    }
  },
  moveTaskUp: async (id) => {
    console.log("0")
    try {
      console.log("1")
      let fTask = await getState().getTask(id);
      let sTask = fTask.prev ? await getState().getTask(fTask.prev) : null;
      console.log("2")
      if (!sTask) {
        return;
      }
      console.log("3")
      let pTask = sTask.prev ? await getState().getTask(sTask.prev) : null;
      let nTask = fTask.next ? await getState().getTask(fTask.next) : null;
      const { updateTaskHelper } = await getState(); // Get updateTask from state
      console.log("4")
      //fast ui update
      let newMyTasks = [...getState().myTasks];
      let index = newMyTasks.findIndex((task) => task._id === fTask._id);
      [newMyTasks[index], newMyTasks[index - 1]] = [newMyTasks[index - 1], newMyTasks[index]];
      console.log("5")
      set(() => ({ myTasks: newMyTasks }));
      //db update
      fTask.prev = pTask ? pTask._id : null;
      fTask.next = sTask ? sTask._id : null;
      console.log("6")
      let result = await updateTaskHelper(fTask);
      if (!result.success) return result;
      sTask.prev = fTask._id;
      sTask.next = nTask._id;
      result = await updateTaskHelper(sTask);
      if (!result.success) return result;
      console.log("7")
      if (nTask) {
        nTask.prev = sTask._id;
        result = await updateTaskHelper(nTask);
        if (!result.success) return result;
      }
      console.log("8")
      if (pTask) {
        pTask.next = fTask._id;
        result = await updateTaskHelper(pTask);
        if (!result.success) return result;
      }
      console.log("9")
      return {success: true, message: "moved up"}
    } catch (error) {
      console.error("Error moving task:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error moving task",
      };
    }
  },
}));
