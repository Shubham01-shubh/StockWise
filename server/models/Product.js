
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
