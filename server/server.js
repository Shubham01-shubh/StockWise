
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const stockMovementRoutes = require("./routes/stockMovementRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "StockWise API is running successfully",
  });
});

// Product CRUD routes
app.use("/api/products", productRoutes);

// Stock Movement routes
app.use("/api/movements", stockMovementRoutes);

// Supplier CRUD routes
app.use("/api/suppliers", supplierRoutes);

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
