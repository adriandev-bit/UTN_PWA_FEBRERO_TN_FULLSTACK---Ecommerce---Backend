import Cart from "../models/Cart.model.js";
import { ServerError } from "../utils/errors.utils.js";
import Product from "../models/Product.model.js";

class CartRepository {

    async getCartByUserId(userId) {
        return Cart.findOne({ user: userId }).populate('products.product');
    }

   
    async addProductToCart(userId, productId, quantity) {
        let cart = await Cart.findOne({ user: userId });

       
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

       
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (existingProductIndex !== -1) {
           
            cart.products[existingProductIndex].quantity += quantity;
        } else {
           
            const product = await Product.findById(productId);
            if (!product) {
                throw new ServerError("Producto no encontrado", 404);
            }

            cart.products.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

       
        await cart.save();
        return cart;
    }

    
    async removeProductFromCart(userId, productId) {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            throw new ServerError("Carrito no encontrado", 404);
        }

       
        cart.products = cart.products.filter(p => p.product.toString() !== productId);

        await cart.save();
        return cart;
    }

    
    async clearCart(userId) {
        const cart = await Cart.findOneAndDelete({ user: userId });
        if (!cart) {
            throw new ServerError("Carrito no encontrado", 404);
        }

        return { success: true, message: "Carrito vacío" };
    }
}

const cartRepository = new CartRepository();
export default cartRepository;
