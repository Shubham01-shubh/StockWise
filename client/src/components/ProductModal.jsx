
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  price: "",
  quantity: "",
  lowStockThreshold: "5",
};

export default function ProductModal({
  open,
  onClose,
  onSave,
  product,
}) {
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        product
          ? {
              name: product.name ?? "",
              sku: product.sku ?? "",
              category: product.category ?? "",
              price: String(product.price ?? ""),
              quantity: String(product.quantity ?? ""),
              lowStockThreshold: String(
                product.lowStockThreshold ?? 5
              ),
            }
          : emptyProduct
      );
      setError("");
    }
  }, [open, product]);

  if (!open) return null;

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.sku.trim() ||
      !form.category.trim() ||
      form.price === "" ||
      form.quantity === "" ||
      form.lowStockThreshold === ""
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0 ||
      !Number.isInteger(Number(form.quantity)) ||
      Number(form.quantity) < 0 ||
      !Number.isInteger(Number(form.lowStockThreshold)) ||
      Number(form.lowStockThreshold) < 0
    ) {
      setError(
        "Price must be non-negative. Quantity and threshold must be non-negative whole numbers."
      );
      return;
    }

    setSaving(true);

    try {
      await onSave({
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        category: form.category.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        lowStockThreshold: Number(form.lowStockThreshold),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-backdrop-custom"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="modal-heading">
          <div>
            <h2 id="product-modal-title">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p>Enter the product details below.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field full-width">
              Product Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Mouse"
                maxLength={100}
                required
              />
            </label>

            <label className="form-field">
              SKU
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="e.g. ELEC-001"
                maxLength={50}
                required
              />
            </label>

            <label className="form-field">
              Category
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                maxLength={60}
                required
              />
            </label>

            <label className="form-field">
              Price (₹)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field">
              Quantity
              <input
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </label>

            <label className="form-field full-width">
              Low Stock Threshold
              <input
                name="lowStockThreshold"
                type="number"
                min="0"
                step="1"
                value={form.lowStockThreshold}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : product
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
