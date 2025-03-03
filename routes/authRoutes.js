import express from "express";
import {
  signup,
  login,
  fetchUsers,
  updateUser,
} from "../controllers/authController.js";
import { upload } from "../controllers/blogController.js";
import authenticate from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// POST request for user signup
router.post("/signup", signup);
router.post("/login", login, authenticate, authorize);
router.get("/users", fetchUsers);
router.put("/profile/:id", upload, updateUser);
export default router;
