import ProfImage from "../models/profModel.js";
import { User } from "../models/User.js";

export const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.body; // Expecting userId from the request body
    const file = req.file ? req.file.filename : null;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Store profile image record
    const newProfileImage = await ProfImage.create({
      userId,
      filePath: `uploads/${file}`, // Storing relative path
    });

    res.status(201).json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImage: newProfileImage,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you're passing the user ID as a parameter

    // Fetch user and associated profile image
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: ProfImage,
          attributes: ["filePath"], // Only fetching the filePath from ProfImage table
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Include the profile image URL in the response
    const profileImage = user.ProfImage ? user.ProfImage.filePath : null;

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      file: profileImage, // Include profile image in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
