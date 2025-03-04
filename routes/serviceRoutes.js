import express from "express";
import { upload } from "../config/cloudinary.js";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

// Service Routes
router.post("/", upload.single("image"), createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.put("/:id", upload.single("image"), updateService);
router.delete("/:id", deleteService);

export default router;
