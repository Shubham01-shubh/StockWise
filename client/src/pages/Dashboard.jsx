
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Package,
  Boxes,
  IndianRupee,
  AlertTriangle,
  Search,
  Bell,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { getProducts } from "../services/productService";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movementLoading, setMovementLoading] = useState(true);
  const [error, setError] = useState("");
  const [movementError, setMovementError] = useState("");

  const location = useLocation();

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setMovementLoading(true);
      setError("");
      setMovementError("");

      const productRequest = getProducts()
        .then(setProducts)
        .catch((err) => {
          setError(err.message || "Failed to load products.");
        })
        .finally(() => setLoading(false));

      const movementRequest = fetch(`${API_URL}/movements`)
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to load recent activity."
            );
          }

          setMovements(data);
        })
        .catch((err) => {
          setMovementError(
            err.message || "Failed to load recent activity."
          );
        })
        .finally(() => setMovementLoading(false));

      await Promise.all([productRequest, movementRequest]);
    }

    loadDashboard();
  }, []);

  // Scroll to the requested dashboard section after rendering.
  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.slice(1);

    const timer = setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);

  const totalUnits = products.reduce(
    (sum, product) => sum + Number(product.quantity || 0),
    0
  );

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.price || 0) * Number(product.quantity || 0),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity) <=
      Number(product.lowStockThreshold ?? 5)
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your inventory today.</p>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>
          <div className="avatar">SW</div>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Inventory Summary */}
      <section id="inventory-summary" className="stats-grid">
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

      {/* Low-Stock Summary */}
      <section
        id="low-stock"
        className="content-card dashboard-section"
      >
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
            <span>
              No products are currently below their stock threshold.
            </span>
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
                    <td>{product.lowStockThreshold ?? 5}</td>
                    <td>
                      <span className="status-badge low">
                        Low stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section
        id="recent-activity"
        className="content-card dashboard-section"
      >
        <div className="section-heading">
          <div>
            <h2>Recent Stock Activity</h2>
            <p>Latest incoming and outgoing stock transactions</p>
          </div>

          <History size={21} />
        </div>

        {movementError && (
          <div className="error-banner">{movementError}</div>
        )}

        {movementLoading ? (
          <div className="empty-state">
            Loading recent activity...
          </div>
        ) : movements.length === 0 ? (
          <div className="empty-state">
            <History size={28} />
            <strong>No recent activity</strong>
            <span>
              Stock movements will appear here once recorded.
            </span>
          </div>
        ) : (
          <div className="movement-list">
            {movements.slice(0, 5).map((movement) => (
              <article
                className="movement-item"
                key={movement._id}
              >
                <div
                  className={`movement-icon ${
                    movement.type === "IN"
                      ? "movement-in"
                      : "movement-out"
                  }`}
                >
                  {movement.type === "IN" ? (
                    <ArrowDownToLine size={18} />
                  ) : (
                    <ArrowUpFromLine size={18} />
                  )}
                </div>

                <div className="movement-details">
                  <strong>
                    {movement.product?.name || "Deleted product"}
                  </strong>
                  <span>
                    {movement.reason || movement.type} ·{" "}
                    {formatDate(movement.createdAt)}
                  </span>
                  <small>
                    Balance after: {movement.balanceAfter ?? "—"} units
                  </small>
                </div>

                <div
                  className={`movement-quantity ${
                    movement.type === "IN" ? "positive" : "negative"
                  }`}
                >
                  {movement.type === "IN" ? "+" : "−"}
                  {movement.quantity}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="page-footer">
        StockWise · Inventory Management System
      </footer>
    </div>
  );
}
