import Product from "../models/Product.model.js";
import { ServerError } from "../utils/errors.utils.js";
import categoryRepository from "./category.repository.js";
import Review from "../models/Review.model.js";


class ProductRepository {

async findProductById(product_id) {
        try {
            
            const product = await Product.findById(product_id).populate('category');
            if (!product) {
                throw new ServerError('Producto no encontrado', 404); 
            }
            return product;
        } catch (error) {
            throw new ServerError('Error al buscar el producto', 500);
        }
    }


      async findAllProducts() {
        try {
            const products = await Product.find().populate('category');
            return products;
        } catch (error) {
            throw new ServerError('Error retrieving products', 500);
        }
    }
      
    async createProduct({ name, category_id, user_id }) {
        console.log({name, category_id, user_id})
        const category_found = await categoryRepository.findCategoryById(category_id)
        if (!category_found) {
            throw new ServerError("Category not found", 404)
        }
        console.log({user_id})
        console.log(category_found.members)
        if(!category_found.members.includes(user_id)){
            throw new ServerError("You are not member of this category", 403)
        }

        const product = await Product.create(
            {
                name,
                category: category_id,
                created_by: user_id
            }
        )
        return product

    }

    async deleteProduct (product_id, user_id) {
    
        const product = await Product.findById(product_id);
        if (!product) {
            throw new ServerError('Product not found', 404); 
        }
    
      
        if (!product.created_by.equals(user_id)) {
            throw new ServerError('You do not have permission to delete this product', 403); 
        }

        
        await Review.deleteMany({ product: product_id });
    
        
        await Product.findByIdAndDelete(product_id);
    
        return { success: true, message: 'Product deleted successfully' }
    }


    
}
    
const productRepository = new ProductRepository()
export default productRepository