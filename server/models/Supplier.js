
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      maxlength: 100,
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 150,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"],
      maxlength: 20,
    },
    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: 300,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);
