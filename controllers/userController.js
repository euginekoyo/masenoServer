import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,

      password: hashedPassword,
      role: role || "buyer", // Default role
    });
    
    const token = jwt.sign(
      {
        userId: newUser._id,
        name: newUser.name,
        email:newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "your_jwt_secret", // Use env variable for security
      { expiresIn: "1h" }
    );
    await newUser.save();

    return res
      .status(200)
      .json({ message: "User registered successfully", newUser ,token});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("Login request received:", req.body); // Debug: Check request body

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    // console.log("User found in DB:", user); // Debug: Check if user is retrieved

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password); // ✅ Compare plain text vs hashed password

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("Password match result:", isMatch); // Debug: Check password comparison

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.json({ token, user });
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      process.env.JWT_SECRET, // Use env variable for security
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful"});
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const fetchUsers = async (req, res) => {
  try {

    const users = await User.find({}, "_id name email role"); // Select only necessary fields
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

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
