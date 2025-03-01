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
            console.error("Error fetching Tasks:", error);
        }
    },
    deleteMyTask: async (id) => {
        try {
            const task = await getState().getTask(id);
            const pTask = task.prev ? await getState().getTask(task.prev) : null;
            const nTask = task.next ? await getState().getTask(task.next) : null;
            pTask && pTask.next === id && (pTask.next = nTask);
            nTask && nTask.prev === id && (nTask.prev = pTask);
            return { success: true, message: "Task deleted successfully" };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Something went wrong.",
            };
        }
    },
}));
