
const Supplier = require("../models/Supplier");

// GET all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
};

// GET one supplier
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: "Invalid supplier ID" });
  }
};

// CREATE supplier
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create supplier" });
  }
};

// UPDATE supplier
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(400).json({ message: "Unable to update supplier" });
  }
};

// DELETE supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid supplier ID" });
  }
};
