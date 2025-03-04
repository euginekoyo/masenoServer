import express from "express";
import productRoutes from "./productRoutes.js";
import serviceRoutes from "./serviceRoutes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/services", serviceRoutes);

export default router;
