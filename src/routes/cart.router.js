import express from "express";
import { getCartController, addToCartController, removeFromCartController } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCartController);
router.post("/:product_id", authMiddleware, addToCartController);
router.delete("/:product_id", authMiddleware, removeFromCartController);

export default router;
