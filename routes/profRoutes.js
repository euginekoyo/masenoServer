import express from "express";
import {
  getUserProfile,
  uploadProfileImage,
} from "../controllers/profController.js";
import { upload } from "../controllers/blogController.js";

const router = express.Router();

// Route for uploading profile image
router.post("/upload", upload, uploadProfileImage);
router.get("/:id", getUserProfile);
export default router;
