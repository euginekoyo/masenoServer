import express from "express";
import { signup, login, fetchUsers, updateUser } from "../controllers/userController.js";
import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";
const router = express.Router();

// User Routes
router.post("/signup", signup);
router.post("/signin", login,authenticate,authorize);
router.get("/users", fetchUsers);
router.put("/users/:id", updateUser);

export default router;
