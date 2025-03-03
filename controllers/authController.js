// controllers/userController.js
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || role.USER;
    // Create a new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role
    });

    return res
      .status(200)
      .json({ message: "User registered successfully", newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};
export const login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const Users = await User.findOne({ where: { email } });

    if (!Users) {
      console.log("User not found");
      return res.status(404).json({ message: "user not found" });
    }

    //  console.log("User found:", Users.role);

    const isMatch = await bcrypt.compare(password, Users.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ message: "invalid password" });
    }

    const token = jwt.sign(
      { userId: Users.id, role: Users.role },
      "your_jwt_secret",
      {
        expiresIn: "1h",
      }
    );
    // console.log("JWT token generated:", token);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: Users.id,
        name: Users.name,
        email: Users.email,
        role: Users.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

// Fetch all users
export const fetchUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email"], // Select only necessary fields
    });
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle file upload (if provided)
    const profile = req.file
      ? {
          file: `uploads/${req.file.filename}`, // Store file path in 'profile' field
        }
      : {};

    // Update user with new values
    await User.update(
      {
        name: name || user.name,
        email: email || user.email,
        ...profile,
      },
      {
        where: { id }, // ADD THIS LINE: Specifies which user to update
      }
    );

    // Fetch updated user
    const updatedUser = await User.findByPk(id);

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
