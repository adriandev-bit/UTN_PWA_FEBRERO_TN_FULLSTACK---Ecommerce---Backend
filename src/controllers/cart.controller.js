import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { ServerError } from "../utils/errors.utils.js";
import { AUTHORIZATION_TOKEN_PROPS } from "../utils/constants/token.constants.js";

export const getCartController = async (req, res) => {
    try {
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]; 
        const cart = await Cart.findOne({ user: user_id }).populate("products.product");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Carrito no encontrado" });
        }

        res.json({ success: true, data: cart });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

export const addToCartController = async (req, res) => {
    try {
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]; 
        const { quantity } = req.body;
        const { price } = req.body;
        const { product_id } = req.params;

        const product = await Product.findById(product_id);
        if (!product) {
            throw new ServerError("Producto no encontrado", 404);
        }

        let cart = await Cart.findOne({ user: user_id });

        if (!cart) {
            cart = new Cart({ user: user_id, products: [] });
        }

        
        const productIndex = cart.products.findIndex((item) => item.product.toString() === product_id);
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += quantity; 
        } else {
            cart.products.push({ product: product_id, quantity, price  });
        }

        await cart.save();

        res.status(201).json({
            success: true,
            message: "Producto añadido al carrito",
            data: cart,
        });
    } catch (error) {
        console.log("Error al añadir producto al carrito:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

export const removeFromCartController = async (req, res) => {
    try {
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]; 
        const { product_id } = req.params;

        const cart = await Cart.findOne({ user: user_id });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Carrito no encontrado" });
        }

        
        const productIndex = cart.products.findIndex(item => item.product.toString() === product_id);

        if (productIndex >= 0) {
          
            if (cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
            } else {
               
                cart.products.splice(productIndex, 1);
            }

            await cart.save();
            return res.json({
                success: true,
                message: "Cantidad actualizada o producto eliminado",
                data: cart,
            });
        }

        res.status(404).json({ success: false, message: "Producto no encontrado en el carrito" });
    } catch (error) {
        console.log("Error al actualizar el carrito:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

