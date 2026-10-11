
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Truck,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import SupplierModal from "../components/SupplierModal";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/suppliers`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load suppliers.");
      }

      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Unable to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) =>
      [
        supplier.name,
        supplier.contactPerson,
        supplier.email,
        supplier.phone,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [suppliers, search]);

  async function handleSave(supplierData) {
    const isEditing = Boolean(selectedSupplier);

    const response = await fetch(
      isEditing
        ? `${API_URL}/suppliers/${selectedSupplier._id}`
        : `${API_URL}/suppliers`,
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save supplier.");
    }

    await loadSuppliers();
  }

  async function handleDelete(supplier) {
    const confirmed = window.confirm(
      `Delete supplier "${supplier.name}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/suppliers/${supplier._id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete supplier.");
      }

      await loadSuppliers();
    } catch (err) {
      setError(err.message || "Unable to delete supplier.");
    }
  }

  function openAddModal() {
    setSelectedSupplier(null);
    setModalOpen(true);
  }

  function openEditModal(supplier) {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  }

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">BUSINESS DIRECTORY</span>
          <h1>Suppliers</h1>
          <p>Manage supplier information and contact details.</p>
        </div>

        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Supplier
        </button>
      </header>

      <section className="product-summary">
        <div className="product-summary-icon">
          <Truck size={23} />
        </div>
        <div>
          <span>Total suppliers</span>
          <h2>{suppliers.length}</h2>
        </div>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="content-card">
        <div className="products-toolbar">
          <div>
            <h2>Supplier Directory</h2>
            <p>Search and manage registered suppliers.</p>
          </div>

          <label className="search-box">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search suppliers..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <div className="empty-state">Loading suppliers...</div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="empty-state">
            <Truck size={30} />
            <strong>
              {search ? "No matching suppliers" : "No suppliers yet"}
            </strong>
            <span>
              {search
                ? "Try a different search term."
                : "Add a supplier to start building your directory."}
            </span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Contact Person</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id}>
                    <td className="product-name">{supplier.name}</td>
                    <td>{supplier.contactPerson || "—"}</td>
                    <td>
                      {supplier.email ? (
                        <span className="supplier-contact">
                          <Mail size={13} />
                          {supplier.email}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span className="supplier-contact">
                        <Phone size={13} />
                        {supplier.phone}
                      </span>
                    </td>
                    <td>{supplier.address || "—"}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="action-button edit-action"
                          onClick={() => openEditModal(supplier)}
                          aria-label={`Edit ${supplier.name}`}
                          title="Edit supplier"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-button delete-action"
                          onClick={() => handleDelete(supplier)}
                          aria-label={`Delete ${supplier.name}`}
                          title="Delete supplier"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="table-footer">
          Showing {filteredSuppliers.length} of {suppliers.length} suppliers
        </div>
      </section>

      <SupplierModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        supplier={selectedSupplier}
      />
    </div>
  );
}
