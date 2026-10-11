
const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Movement quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockMovement", stockMovementSchema);
