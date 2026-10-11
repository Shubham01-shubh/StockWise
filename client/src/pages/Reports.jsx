
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Package,
  Boxes,
  IndianRupee,
  AlertTriangle,
  Download,
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function downloadCSV(filename, rows) {
  if (!rows.length) {
    alert("No data available to export.");
    return;
  }

  const escapeCSV = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Reports() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, movementsResponse] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/movements`),
      ]);

      if (!productsResponse.ok || !movementsResponse.ok) {
        throw new Error("Could not load report data from the server.");
      }

      const [productsData, movementsData] = await Promise.all([
        productsResponse.json(),
        movementsResponse.json(),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setMovements(Array.isArray(movementsData) ? movementsData : []);
    } catch (err) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          Number(product.quantity) <=
          Number(product.lowStockThreshold ?? 5)
      ),
    [products]
  );

  const summary = useMemo(
    () => ({
      productCount: products.length,

      totalUnits: products.reduce(
        (sum, product) => sum + Number(product.quantity || 0),
        0
      ),

      inventoryValue: products.reduce(
        (sum, product) =>
          sum +
          Number(product.price || 0) * Number(product.quantity || 0),
        0
      ),

      lowStockCount: lowStockProducts.length,

      stockIn: movements
        .filter((movement) => movement.type === "IN")
        .reduce((sum, movement) => sum + Number(movement.quantity || 0), 0),

      stockOut: movements
        .filter((movement) => movement.type === "OUT")
        .reduce((sum, movement) => sum + Number(movement.quantity || 0), 0),
    }),
    [products, movements, lowStockProducts]
  );

  const exportInventory = () => {
    const rows = [
      [
        "Product Name",
        "SKU",
        "Category",
        "Unit Price (INR)",
        "Quantity",
        "Low Stock Threshold",
        "Inventory Value (INR)",
      ],
      ...products.map((product) => [
        product.name,
        product.sku,
        product.category,
        product.price,
        product.quantity,
        product.lowStockThreshold ?? 5,
        Number(product.price || 0) * Number(product.quantity || 0),
      ]),
    ];

    downloadCSV("StockWise_Inventory_Report.csv", rows);
  };

  const exportLowStock = () => {
    const rows = [
      ["Product Name", "SKU", "Category", "Quantity", "Low Stock Threshold"],
      ...lowStockProducts.map((product) => [
        product.name,
        product.sku,
        product.category,
        product.quantity,
        product.lowStockThreshold ?? 5,
      ]),
    ];

    downloadCSV("StockWise_Low_Stock_Report.csv", rows);
  };

  const exportMovements = () => {
    const rows = [
      [
        "Date",
        "Product Name",
        "SKU",
        "Movement Type",
        "Quantity",
        "Reason",
        "Balance After",
      ],
      ...movements.map((movement) => [
        movement.createdAt,
        movement.product?.name || "Deleted product",
        movement.product?.sku || "",
        movement.type,
        movement.quantity,
        movement.reason,
        movement.balanceAfter,
      ]),
    ];

    downloadCSV("StockWise_Movement_Report.csv", rows);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="reports-heading">
          <div>
            <span className="reports-eyebrow">
              <BarChart3 size={15} />
              INVENTORY INSIGHTS
            </span>
            <h1>Reports & Analytics</h1>
            <p>Loading your latest inventory data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="reports-heading">
        <div>
          <span className="reports-eyebrow">
            <BarChart3 size={15} />
            INVENTORY INSIGHTS
          </span>
          <h1>Reports & Analytics</h1>
          <p>Monitor inventory value, stock levels, and movement history.</p>
        </div>

        <button
          className="btn-secondary"
          type="button"
          onClick={loadReports}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="reports-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={loadReports}>
            Try again
          </button>
        </div>
      )}

      {/* Inventory overview */}
      <div className="reports-stats">
        <div className="report-stat-card">
          <div className="report-stat-icon purple">
            <Package size={21} />
          </div>
          <span>Total Products</span>
          <strong>{summary.productCount}</strong>
          <small>Distinct products in inventory</small>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon blue">
            <Boxes size={21} />
          </div>
          <span>Total Units</span>
          <strong>{summary.totalUnits.toLocaleString("en-IN")}</strong>
          <small>Units currently available</small>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon green">
            <IndianRupee size={21} />
          </div>
          <span>Inventory Value</span>
          <strong>{formatCurrency(summary.inventoryValue)}</strong>
          <small>Quantity × unit price</small>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon orange">
            <AlertTriangle size={21} />
          </div>
          <span>Low-Stock Products</span>
          <strong>{summary.lowStockCount}</strong>
          <small>At or below stock threshold</small>
        </div>
      </div>

      {/* Stock movement summary */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <div>
            <h2>Stock Movement Summary</h2>
            <p>Total quantities recorded in movement history</p>
          </div>

          <button
            className="btn-secondary"
            type="button"
            onClick={exportMovements}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="movement-summary-grid">
          <div className="movement-summary-card">
            <span className="movement-summary-icon stock-in">
              <ArrowDownToLine size={20} />
            </span>
            <div>
              <small>Total Stock In</small>
              <strong>
                {summary.stockIn.toLocaleString("en-IN")} units
              </strong>
            </div>
          </div>

          <div className="movement-summary-card">
            <span className="movement-summary-icon stock-out">
              <ArrowUpFromLine size={20} />
            </span>
            <div>
              <small>Total Stock Out</small>
              <strong>
                {summary.stockOut.toLocaleString("en-IN")} units
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Low-stock report */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <div>
            <h2>Low-Stock Report</h2>
            <p>Products that may need replenishment</p>
          </div>

          <button
            className="btn-secondary"
            type="button"
            onClick={exportLowStock}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Available</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="reports-empty">
                    All products are above their low-stock thresholds.
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>{product.lowStockThreshold ?? 5}</td>
                    <td>
                      <span className="report-status-low">Low Stock</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Full inventory report */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <div>
            <h2>Inventory Report</h2>
            <p>Current stock and estimated inventory value per product</p>
          </div>

          <button
            className="btn-primary"
            type="button"
            onClick={exportInventory}
          >
            <Download size={16} />
            Export Inventory
          </button>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Value</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="reports-empty">
                    No products found. Add products to see the report.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.quantity}</td>
                    <td>
                      {formatCurrency(
                        Number(product.price || 0) *
                          Number(product.quantity || 0)
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent stock movement history */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <div>
            <h2>Recent Stock Movements</h2>
            <p>Latest stock IN and OUT transactions</p>
          </div>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Reason</th>
                <th>Balance After</th>
              </tr>
            </thead>

            <tbody>
              {movements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="reports-empty">
                    No stock movements have been recorded yet.
                  </td>
                </tr>
              ) : (
                movements.slice(0, 10).map((movement) => (
                  <tr key={movement._id}>
                    <td>{formatDate(movement.createdAt)}</td>
                    <td>
                      {movement.product?.name || "Deleted product"}
                    </td>
                    <td>
                      <span
                        className={
                          movement.type === "IN"
                            ? "report-status-in"
                            : "report-status-out"
                        }
                      >
                        {movement.type}
                      </span>
                    </td>
                    <td>{movement.quantity}</td>
                    <td>{movement.reason}</td>
                    <td>{movement.balanceAfter}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
