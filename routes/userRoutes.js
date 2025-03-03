import express from "express";
import { signup, login, fetchUsers, updateUser } from "../controllers/userController.js";
const router = express.Router();

// User Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/users", fetchUsers);
router.put("/users/:id", updateUser);

export default router;
