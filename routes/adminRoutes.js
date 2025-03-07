import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { getAdminDashboard, getAllProducts, deleteProduct } from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard
router.get("/dashboard", authenticate, authorize(["admin"]), getAdminDashboard);

// Get all products (no seller reference)
router.get("/products", authenticate, authorize(["admin"]), getAllProducts);

// Delete a product
router.delete("/products/:id", authenticate, authorize(["admin"]), deleteProduct);

export default router;
