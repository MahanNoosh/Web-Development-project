import { create } from "zustand";
import axios from "axios";

export const useProductStore = create((set) => ({
  products: [],

  createProduct: async (newProduct) => {
    const { isValidProduct } = useProductStore.getState();
    if (!isValidProduct(newProduct)) {
      return { success: false, message: error.response?.data?.message || "Please enter all the fields correctly" };
    }

    try {
      const { data } = await axios.post("/api/products", newProduct, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      set((state) => ({ products: [...state.products, data] }));
      return { success: true, message: "Product created successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Something went wrong." };
    }
  },

  fetchProducts: async () => {
    try {
      const { data } = await axios.get("/api/products");
      set({ products: data.data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },

  isValidProduct: (newProduct) => {
    return newProduct.name && newProduct.price;
  },

  deleteProduct: async (id) => {
    try {
      const { data } = await axios.delete(`/api/products/${id}`);
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Something went wrong." };
    }
  },

  updateProduct: async (id, updatedProduct) => {
    try {
      const { data } = await axios.put(`/api/products/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!data.success) return { success: false, message: data.message };
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? data.data : product
        ),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Something went wrong." };
    }
  },
}));
