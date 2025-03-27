import Review from "../models/Review.model.js";
import Product from "../models/Product.model.js";
import { AUTHORIZATION_TOKEN_PROPS } from "../utils/constants/token.constants.js";


export const createReviewController = async (req, res) => {
    try {
        const { product_id, content, rating } = req.body;
        
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]; 


    
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        const new_review = new Review({
            product: product_id,
            reviewer: user_id,
            content,
            rating
        });

        await new_review.save();
        res.status(201).json({
            success: true,
            message: "Reseña creada exitosamente",
            data: { new_review }
        });
    } catch (error) {
        console.error("Error al crear la reseña:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }

};


export const getReviewsByProductController = async (req, res) => {
    try {
        const { product_id } = req.params;
        const reviews = await Review.find({ product: product_id }).populate("reviewer", "name");

        res.json({
            ok: true,
            status: 200,
            data: reviews
        });
    } catch (error) {
        console.error("Error al obtener las reseñas del producto", error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Internal server error"
        });
    }
};