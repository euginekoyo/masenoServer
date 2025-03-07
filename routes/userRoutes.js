import express from "express";
import { signup, login } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// User Routes
router.post("/signup", signup);
router.post("/login", login);

export default router;
