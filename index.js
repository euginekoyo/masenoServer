import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import morgan from "morgan"; // Import Morgan for logging
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // Import auth routes
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Morgan Middleware to log requests
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res), // GET, POST, PUT, etc.
      tokens.url(req, res), // Request URL
      res.statusCode, // Response status code
      tokens["response-time"](req, res) + " ms", // Response time
    ].join(" | ");
  })
);

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);

// Admin routes

app.use('/api/admin', adminRoutes);

// Connect to MongoDB and Start Server
connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
  });

export default app;
