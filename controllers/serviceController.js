import { Service } from "../models/Service.js";
import cloudinary from "../config/cloudinary.js";

// Create Service with Image Upload to Cloudinary
export const createService = async (req, res) => {
  const { name, description, price,category } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Cloudinary returns file path as the image URL

  try {
    const newService = new Service({
      name,
      description,
      price,
      category,
      image: imageUrl,
    });

    await newService.save();
    return res
      .status(201)
      .json({ message: "Service created successfully", newService });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    let { page, limit, search, name } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10; // Default to 10 items per page

    // Build search query
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search on 'name'
    }
    if (name) {
      query.name = name; // Filter by name if provided
    }

    // Get total count for pagination
    const totalServices = await Service.countDocuments(query);

    // Fetch services with pagination
    const services = await Service.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      data: services,
      totalServices,
      totalPages: Math.ceil(totalServices / limit),
      currentPage: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price,category } = req.body;
    const imageUrl = req.file ? req.file.path : req.body.image;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, description, price,category, image: imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res
      .status(200)
      .json({ message: "Service updated successfully", updatedService });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};
