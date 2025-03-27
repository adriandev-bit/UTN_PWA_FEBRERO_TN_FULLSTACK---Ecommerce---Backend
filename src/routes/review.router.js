import { Router } from "express"
import { createReviewController, getReviewsByProductController } from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const reviewRouter = Router()

reviewRouter.post("/", authMiddleware, createReviewController);
reviewRouter.get("/:product_id", getReviewsByProductController);

export default reviewRouter;
