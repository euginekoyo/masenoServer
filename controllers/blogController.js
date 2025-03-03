import { Blog } from "../models/Blog.js";
import { Comment } from "../models/Comment.js";
import multer from "multer";
import path from "path";
// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/mkv",
    "video/avi",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter,
}).single("file");

// Create a new blog with file upload
export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Please select a file" });
    }

    // Create a new blog
    const blog = await Blog.create({
      title,
      content,
      fileURL: `uploads/${req.file.filename}`,
    });
    console.log(blog);
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving blogs", error });
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving blog", error });
  }
};

// Update a blog by ID
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find the blog by ID
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Handle file upload (if provided)
    const file = req.file
      ? {
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
        }
      : {};

    // Update the blog
    await blog.update({
      title: title || blog.title,
      content: content || blog.content,
      ...file,
    });

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// Delete a blog by ID
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog by ID
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the blog
    await blog.destroy();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

// Like a blog
export const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.likes += 1;
    await blog.save();
    res.status(200).json({ message: "Blog liked", likes: blog.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Save a blog
export const saveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.saves += 1;
    await blog.save();
    res.status(200).json({ message: "Blog saved", saves: blog.saves });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retweet a blog
export const retweetBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.retweets += 1;
    await blog.save();
    res.status(200).json({ message: "Blog retweeted", retweets: blog.retweets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a comment to a blog
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = await Comment.create({ blogId: id, content });
    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};