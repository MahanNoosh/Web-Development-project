import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },  
    price: {
        type: String,
        required: true,
        default: 0
    },
    creator:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;