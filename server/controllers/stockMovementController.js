
const mongoose = require("mongoose");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");

// GET /api/movements
exports.getMovements = async (req, res) => {
  try {
    const movements = await StockMovement.find()
      .populate("product", "name sku category")
      .sort({ createdAt: -1 });

    res.json(movements);
  } catch (error) {
    console.error("Fetch movements error:", error.message);
    res.status(500).json({
      message: "Failed to fetch stock movements",
    });
  }
};

// POST /api/movements
exports.createMovement = async (req, res) => {
  const { productId, type, quantity, reason } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({
      message: "A valid product ID is required",
    });
  }

  if (!["IN", "OUT"].includes(type)) {
    return res.status(400).json({
      message: "Movement type must be IN or OUT",
    });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      message: "Quantity must be a positive whole number",
    });
  }

  if (
    typeof reason !== "string" ||
    !reason.trim() ||
    reason.trim().length > 200
  ) {
    return res.status(400).json({
      message: "A reason of 1–200 characters is required",
    });
  }

  try {
    const change = type === "IN" ? quantity : -quantity;

    // Update stock atomically, without a transaction.
    const filter = {
      _id: productId,
      ...(type === "OUT" ? { quantity: { $gte: quantity } } : {}),
    };

    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { quantity: change } },
      { returnDocument: "after", runValidators: true }
    );

    if (!product) {
      const exists = await Product.exists({ _id: productId });

      return res.status(exists ? 400 : 404).json({
        message: exists
          ? "Insufficient stock for this movement"
          : "Product not found",
      });
    }

    try {
      const movement = await StockMovement.create({
        product: product._id,
        type,
        quantity,
        reason: reason.trim(),
        balanceAfter: product.quantity,
      });

      const populatedMovement = await StockMovement.findById(movement._id)
        .populate("product", "name sku category");

      return res.status(201).json({
        message: "Stock movement recorded successfully",
        movement: populatedMovement,
      });
    } catch (error) {
      // Compensate if the history record cannot be saved.
      await Product.updateOne(
        { _id: productId, quantity: product.quantity },
        { $inc: { quantity: -change } }
      );

      throw error;
    }
  } catch (error) {
    console.error("Stock movement error:", error.message);

    res.status(500).json({
      message: "Failed to record stock movement",
      error: error.message,
    });
  }
};
