
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptySupplier = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
};

export default function SupplierModal({
  open,
  onClose,
  onSave,
  supplier,
}) {
  const [form, setForm] = useState(emptySupplier);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        supplier
          ? {
              name: supplier.name ?? "",
              contactPerson: supplier.contactPerson ?? "",
              email: supplier.email ?? "",
              phone: supplier.phone ?? "",
              address: supplier.address ?? "",
            }
          : { ...emptySupplier }
      );
      setError("");
    }
  }, [open, supplier]);

  if (!open) return null;

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Supplier name and phone number are required.");
      return;
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      setError("Enter a valid email address.");
      return;
    }

    setSaving(true);

    try {
      await onSave({
        name: form.name.trim(),
        contactPerson: form.contactPerson.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Unable to save supplier.");
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
        aria-labelledby="supplier-modal-title"
      >
        <div className="modal-heading">
          <div>
            <h2 id="supplier-modal-title">
              {supplier ? "Edit Supplier" : "Add New Supplier"}
            </h2>
            <p>Enter the supplier's contact details.</p>
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
              Supplier Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Mumbai Tech Supplies"
                maxLength={100}
                required
              />
            </label>

            <label className="form-field full-width">
              Contact Person
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                maxLength={100}
              />
            </label>

            <label className="form-field">
              Email Address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="supplier@example.com"
                maxLength={150}
              />
            </label>

            <label className="form-field">
              Phone Number *
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                maxLength={20}
                required
              />
            </label>

            <label className="form-field full-width">
              Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Supplier's business address"
                maxLength={300}
                rows={3}
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
                : supplier
                  ? "Save Changes"
                  : "Add Supplier"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
