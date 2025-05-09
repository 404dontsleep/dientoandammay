const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

dotenv.config();

const app = express();

// Cấu hình CORS với origin cụ thể
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/statistics", statisticsRoutes);

// Wildcard route cho single-page app
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Khởi động server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.BACKEND_PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();