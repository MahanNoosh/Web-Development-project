import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },  
    price: {
        type: String,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;