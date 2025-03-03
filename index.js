import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import profRoutes from "./routes/profRoutes.js";
import sequelize from "./config/db.js"; // Your Sequelize connection
import cors from "cors";
import path from "path";
const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Allow requests from the frontend
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/profile", profRoutes);

// Test the database connection and start the server
sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
  });

export default app;
