import express from "express";
import {deleteProduct, updateProduct, createProduct, getAllProducts } from "../controllers/product.controller.js";

const pRouter = express.Router();

pRouter.get("/", getAllProducts);

pRouter.post("/", createProduct);

pRouter.put("/:id", updateProduct);

pRouter.delete("/:id", deleteProduct);

export default pRouter;
