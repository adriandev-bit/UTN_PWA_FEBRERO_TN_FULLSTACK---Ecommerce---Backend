import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { getAllCategoriesController, createCategoryController } from "../controllers/category.controller.js";

const category_router = Router()

category_router.get("/", authMiddleware, getAllCategoriesController);
category_router.post("/", authMiddleware, createCategoryController);

export default category_router