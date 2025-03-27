import Review from "../models/Review.model.js";
import { ServerError } from "../utils/errors.utils.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";

class ReviewRepository {
    
    async getReviewsByProductId(productId) {
        return Review.find({ product: productId }).populate('reviewer');
    }

  
    async createReview({ productId, reviewerId, content, rating }) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new ServerError("Producto no encontrado", 404);
        }

        const user = await User.findById(reviewerId);
        if (!user) {
            throw new ServerError("Usuario no encontrado", 404);
        }

        const review = new Review({ product: productId, reviewer: reviewerId, content, rating });
        await review.save();
        return review;
    }

    
    async deleteReview(reviewId, userId) {
        const review = await Review.findById(reviewId);
        if (!review) {
            throw new ServerError("Reseña no encontrada", 404);
        }

        
        if (!review.reviewer.equals(userId)) {
            throw new ServerError("No tienes permiso para eliminar esta reseña", 403);
        }

        await Review.findByIdAndDelete(reviewId);
        return { success: true, message: "Reseña eliminada con éxito" };
    }
}

const reviewRepository = new ReviewRepository();
export default reviewRepository;
