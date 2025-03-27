import mongoose from "mongoose";


const product_schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        price: { type: Number, required: true },
        description: { type: String },
        stock: { type: Number, default: 0 },
        image: { type: String },
        created_at: { type: Date, default: Date.now },
        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        onSale: { type: Boolean, default: false },
        discountPrice: { type: Number, default: null },
    }
);


const Product = mongoose.model('Product', product_schema);

export default Product;
