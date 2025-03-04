import express from "express";
import { upload } from "../config/cloudinary.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Product Routes
router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProduct
);

router.get("/", getProducts);

// Corrected route path for getting product by ID
router.get("/:id", getProductById);

router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateProduct
);

router.delete("/:id", deleteProduct);

export default router;
