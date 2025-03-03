import express from "express";
import {
  upload,
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  saveBlog,
  retweetBlog,
  addComment,
} from "../controllers/blogController.js";

const router = express.Router();

// Routes for blog operations
router.post("/", upload, createBlog); // File is optional
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", upload, updateBlog); // Optional file upload
router.delete("/:id", deleteBlog);

router.post("/:id/like", likeBlog);
router.post("/:id/save", saveBlog);
router.post("/:id/retweet", retweetBlog);
router.post("/:id/comment", addComment);

export default router;
