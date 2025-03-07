import Product from "../models/Product.js";

export const getAdminDashboard = (req, res) => {
  res.json({ message: "Admin Dashboard API is working" });
};

// Fetch all products (including images)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    // Ensure that the products include their image URLs
    const productDetails = products.map((product) => {
      return {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        phoneNumber: product.phoneNumber,
        category: product.category,
        brand: product.brand,
        stockQuantity: product.stockQuantity,
        thumbnail: product.thumbnail,  // Single thumbnail image
        images: product.images,        // Array of product images
      };
    });

    return res.status(200).json({ products: productDetails, total: products.length });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
