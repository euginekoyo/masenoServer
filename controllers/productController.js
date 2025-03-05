import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js"; // Adjust the import path as needed
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {

    const { title, description, price, phoneNumber, category, brand, stockQuantity } = req.body;

    // Validate required text fields
    const requiredFields = { title, description, price, phoneNumber, category, brand, stockQuantity };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    // Validate files
    if (!req.files || (!req.files["thumbnail"] && !req.files["images"])) {
      return res.status(400).json({
        message: "Thumbnail and at least one image are required",
        filesStatus: {
          thumbnail: req.files?.thumbnail ? "present" : "missing",
          images: req.files?.images ? "present" : "missing",
        },
      });
    }

    // Process thumbnail upload
    let thumbnailUrl = null;
    if (req.files["thumbnail"] && req.files["thumbnail"][0]) {
      const thumbnailResult = await cloudinary.uploader.upload(
        req.files["thumbnail"][0].path,
        { folder: "products/thumbnails", transformation: [{ width: 500, height: 500, crop: "limit" }] }
      );
      thumbnailUrl = thumbnailResult.secure_url;
    }

    // Process additional images upload
    let imageUrls = [];
    if (req.files["images"] && req.files["images"].length > 0) {
      const imageUploadPromises = req.files["images"].map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "products/images",
          transformation: [{ width: 500, height: 500, crop: "limit" }]
        })
      );

      const imageResults = await Promise.all(imageUploadPromises);
      imageUrls = imageResults.map((result) => result.secure_url);
    }

    // Create new product
    const newProduct = new Product({
      title,
      description,
      price: parseFloat(price),
      phoneNumber,
      category,
      brand,
      stockQuantity: parseInt(stockQuantity, 10),
      thumbnail: thumbnailUrl,
      images: imageUrls,
    });

    // Save product to database
    await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Product Creation Error:", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    // Extract and parse query parameters
    let {
      page = 1,
      limit = 10,
      category,
      brand,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    minPrice = minPrice ? parseFloat(minPrice) : undefined;
    maxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

    // Ensure valid page & limit
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    // Build query object
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Sort configuration
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fetch products & total count simultaneously
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).select("-__v").exec(),
      Product.countDocuments(query),
    ]);

    // Send response
    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, phoneNumber, category, brand } = req.body;

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle file updates
    if (req.files) {
      // Process thumbnail upload if new thumbnail is provided
      if (req.files["thumbnail"] && req.files["thumbnail"][0]) {
        // Delete existing thumbnail from Cloudinary if it exists
        if (existingProduct.thumbnail) {
          const publicId = existingProduct.thumbnail
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(`products/thumbnails/${publicId}`);
        }

        // Upload new thumbnail
        const thumbnailResult = await cloudinary.uploader.upload(
          req.files["thumbnail"][0].path,
          {
            folder: "products/thumbnails",
          }
        );
        existingProduct.thumbnail = thumbnailResult.secure_url;
      }

      // Process additional images upload
      if (req.files["images"] && req.files["images"].length > 0) {
        // Delete existing images from Cloudinary
        if (existingProduct.images && existingProduct.images.length > 0) {
          const deletePromises = existingProduct.images.map((imageUrl) => {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            return cloudinary.uploader.destroy(`products/images/${publicId}`);
          });
          await Promise.all(deletePromises);
        }

        // Upload new images
        const imageUploadPromises = req.files["images"].map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: "products/images",
          })
        );

        const imageResults = await Promise.all(imageUploadPromises);
        existingProduct.images = imageResults.map(
          (result) => result.secure_url
        );
      }
    }

    // Update product details
    existingProduct.title = title;
    existingProduct.description = description;
    existingProduct.price = parseFloat(price);
    existingProduct.phoneNumber = phoneNumber;
    existingProduct.category = category;
    existingProduct.brand = brand;

    // Save updated product
    await existingProduct.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productToDelete = await Product.findById(id);

    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete thumbnail from Cloudinary
    if (productToDelete.thumbnail) {
      const thumbnailPublicId = productToDelete.thumbnail
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(
        `products/thumbnails/${thumbnailPublicId}`
      );
    }

    // Delete images from Cloudinary
    if (productToDelete.images && productToDelete.images.length > 0) {
      const deletePromises = productToDelete.images.map((imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`products/images/${publicId}`);
      });
      await Promise.all(deletePromises);
    }

    // Delete product from database
    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
