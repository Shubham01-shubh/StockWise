
import { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  IndianRupee,
  AlertTriangle,
  Search,
  Bell,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { getProducts } from "../services/productService";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalUnits = products.reduce(
    (sum, product) => sum + Number(product.quantity || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + Number(product.price || 0) * Number(product.quantity || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity) <= Number(product.lowStockThreshold ?? 5)
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your inventory today.</p>
        </div>

        <div className="topbar-actions">
          <button className="icon-button" aria-label="Notifications">
            <Bell size={19} />
          </button>
          <div className="avatar">SW</div>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="stats-grid">
        <StatCard
          title="Total Products"
          value={loading ? "—" : products.length}
          subtitle="Unique products in catalog"
          icon={Package}
          color="purple"
        />

        <StatCard
          title="Total Units in Stock"
          value={loading ? "—" : totalUnits.toLocaleString("en-IN")}
          subtitle="Units currently available"
          icon={Boxes}
          color="blue"
        />

        <StatCard
          title="Inventory Value"
          value={loading ? "—" : formatCurrency(inventoryValue)}
          subtitle="Based on price × quantity"
          icon={IndianRupee}
          color="green"
        />

        <StatCard
          title="Low Stock Items"
          value={loading ? "—" : lowStockProducts.length}
          subtitle="At or below stock threshold"
          icon={AlertTriangle}
          color="orange"
        />
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <h2>Low Stock Alerts</h2>
            <p>Products that may need replenishment</p>
          </div>
          <div className="search-decoration">
            <Search size={16} />
            <span>Inventory overview</span>
          </div>
        </div>

        {loading ? (
          <p className="empty-state">Loading inventory...</p>
        ) : lowStockProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={30} />
            <strong>All stocked up!</strong>
            <span>No products are currently below their stock threshold.</span>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="product-name">{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>{product.lowStockThreshold}</td>
                    <td>
                      <span className="status-badge low">Low stock</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="page-footer">
        StockWise · Inventory Management System
      </footer>
    </div>
  );
}
