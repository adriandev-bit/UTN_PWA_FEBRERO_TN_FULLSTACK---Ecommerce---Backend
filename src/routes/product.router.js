import { Router } from "express"
import { getProductsByCategoryController, createProductController, deleteProductController, getAllProductsController, getProductByIdController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const productRouter = Router()

productRouter.get("/:category_id", getProductsByCategoryController);
productRouter.get('/', getAllProductsController);
productRouter.get('/product/:productId', getProductByIdController);
productRouter.post("/:category_id", authMiddleware, createProductController);
productRouter.delete("/:product_id", authMiddleware, deleteProductController);

export default productRouter;
