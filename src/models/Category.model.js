import mongoose from "mongoose";


const category_schema = new mongoose.Schema(
    {

        name: { type: String, required: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        created_at: { type: Date, default: Date.now }
    }
);


const Category = mongoose.model('Category', category_schema);

export default Category;
