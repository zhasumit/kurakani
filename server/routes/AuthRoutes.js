import { Router } from "express";
import { getUserInfo, login, signup } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

// pass middleware of verifyToken and other middlewares
authRoutes.get("/user-info", verifyToken, getUserInfo);

export default authRoutes;
