import { create } from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        const { isValidProduct } = useProductStore.getState();
        if (!isValidProduct(newProduct)) {
            return { success: false, message: "Please enter all the fields correctly" };
        }
        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        });
        const data = await res.json();
        set((state) => ({ products: [...state.products, data] }));
        return { success: true, message: "Product created successfully" };
    },
    fetchProducts: async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        set({ products: data.data });
    },
    isValidProduct: (newProduct) => {
        return newProduct.name && newProduct.image && newProduct.price;
    },
    deleteProduct: async (id) => {
        const res = await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if(!data.success) return {success: false, message: data.message}
        set(state=> ({products: state.products.filter((product) => product._id !== id)}));
        return {success: true, message: data.message}
    },
    updateProduct: async (id, updatedProduct) => {
        const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await res.json();
        if(!data.success) return {success: false, message: data.message}
        set(state=> ({products: state.products.map((product) => product._id === id ? data.data : product)}));
        return {success: true, message: data.message}
    },
}));
