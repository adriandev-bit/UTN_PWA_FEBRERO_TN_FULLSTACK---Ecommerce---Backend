import express from "express";
import { getUsernameController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/profile", authMiddleware, getUsernameController); 

export default router;
