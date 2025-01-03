import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getAllProducts = async (_, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({success: true, data: products})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}

export const createProduct = async (req, res)=>{
    const product = req.body;
    if (!isValidProduct(product)) {
        return res.status(400).json({succsess: false, message: "Please enter all the fields"})
    }
    const newProduct = new Product(product)
    try {
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}

const isValidProduct = (product) => {
    return product.name && product.image && product.price;
}

export const updateProduct = async (req, res)=>{
    const {id} = req.params;
    const product = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({succsess: false, message: "Product not found"})
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true});
        res.status(200).json({success: true, data: updatedProduct})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}

export const deleteProduct = async (req, res)=>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({succsess: false, message: "Product not found"})
    }
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Product deleted successfully"})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}