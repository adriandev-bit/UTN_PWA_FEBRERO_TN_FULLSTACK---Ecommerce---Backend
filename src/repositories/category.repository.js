import Category from "../models/Category.model.js";
import { ServerError } from "../utils/errors.utils.js";

class CategoryRepository {
    async findCategoryById(id) {
        console.log("id:" + id);
        return await Category.findById(id);
    }

    async createCategory({ name, owner_id }) {
        const category = await Category.create({
            name,
            owner: [owner_id], 
            members: [owner_id] 
        });
        return category;
    }

    async addProductToCategory({ category_id, product_id }) {
        const categoryFound = await this.findCategoryById(category_id);
        
        if (!categoryFound) {
            throw new ServerError('Category not found', 404);
        }

        
        if (categoryFound.products.includes(product_id)) {
            throw new ServerError('Product is already in the category', 400);
        }

        categoryFound.products.push(product_id);
        await categoryFound.save();
        return categoryFound;
    }

    
    async getAllCategories() {
        
        const categories = await Category.find();
        return categories;
    }

    async deleteCategory(category_id, user_id) {
        const category = await this.findCategoryById(category_id);

        if (!category) {
            throw new ServerError("Category not found", 404);
        }

        if (!category.owner.equals(user_id)) {
            throw new ServerError("You don't have permission to delete this category", 403);
        }

        await Category.deleteOne({ _id: category_id });
        return category;
    }
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
