
import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Package,
  RefreshCw,
} from "lucide-react";
import {
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { getProducts } from "../services/productService";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function StockMovement() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("IN");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("Purchase");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Synchronize the selected movement type with the submenu URL.
  useEffect(() => {
    const requestedType = searchParams.get("type");

    if (requestedType === "IN" || requestedType === "OUT") {
      setType(requestedType);
      setSuccess("");
      setError("");
    } else {
      setType("IN");
    }
  }, [searchParams]);

  // Scroll to Movement History when its submenu link is selected.
  useEffect(() => {
    if (location.hash === "#movement-history") {
      document
        .getElementById("movement-history")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [productData, response] = await Promise.all([
        getProducts(),
        fetch(`${API_URL}/movements`),
      ]);

      if (!response.ok) {
        throw new Error("Failed to load stock movement history.");
      }

      const movementData = await response.json();

      setProducts(productData);
      setMovements(movementData);

      setProductId((current) =>
        productData.some((product) => product._id === current)
          ? current
          : productData[0]?._id || ""
      );
    } catch (err) {
      setError(err.message || "Unable to load stock data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = products.find(
    (product) => product._id === productId
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !productId ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      setError(
        "Select a product and enter a positive whole-number quantity."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/movements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          type,
          quantity: Number(quantity),
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to record movement.");
      }

      setSuccess(data.message || "Stock movement recorded successfully.");
      setQuantity("1");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to record movement.");
    } finally {
      setSaving(false);
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const stockInCount = movements.filter(
    (movement) => movement.type === "IN"
  ).length;

  const stockOutCount = movements.filter(
    (movement) => movement.type === "OUT"
  ).length;

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">INVENTORY OPERATIONS</span>
          <h1>Stock Management</h1>
          <p>
            Record incoming and outgoing stock and review transactions.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="stock-overview-cards">
        <button
          type="button"
          className={`stock-overview-card ${
            type === "IN" ? "selected" : ""
          }`}
          onClick={() => {
            setType("IN");
            setReason("Purchase");
            setSuccess("");
            setError("");
          }}
        >
          <span className="stock-overview-icon stock-in-color">
            <ArrowDownToLine size={21} />
          </span>
          <span className="stock-overview-text">
            <small>Stock In Transactions</small>
            <strong>{stockInCount}</strong>
          </span>
        </button>

        <button
          type="button"
          className={`stock-overview-card ${
            type === "OUT" ? "selected" : ""
          }`}
          onClick={() => {
            setType("OUT");
            setReason("Sale");
            setSuccess("");
            setError("");
          }}
        >
          <span className="stock-overview-icon stock-out-color">
            <ArrowUpFromLine size={21} />
          </span>
          <span className="stock-overview-text">
            <small>Stock Out Transactions</small>
            <strong>{stockOutCount}</strong>
          </span>
        </button>

        <button
          type="button"
          className="stock-overview-card"
          onClick={() => {
            document
              .getElementById("movement-history")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span className="stock-overview-icon stock-history-color">
            <History size={21} />
          </span>
          <span className="stock-overview-text">
            <small>Total Movements</small>
            <strong>{movements.length}</strong>
          </span>
        </button>
      </div>

      <div className="movement-layout">
        <section className="content-card movement-form-card">
          <div className="section-heading">
            <div>
              <h2>
                {type === "IN" ? "Record Stock In" : "Record Stock Out"}
              </h2>
              <p>Update inventory quantities.</p>
            </div>
            {type === "IN" ? (
              <ArrowDownToLine size={21} />
            ) : (
              <ArrowUpFromLine size={21} />
            )}
          </div>

          <form className="movement-form" onSubmit={handleSubmit}>
            <label className="form-field">
              Select Product
              <select
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                required
              >
                <option value="">Choose a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </label>

            {selectedProduct && (
              <div className="current-stock">
                <Package size={18} />
                <div>
                  <span>Current available stock</span>
                  <strong>{selectedProduct.quantity} units</strong>
                </div>
              </div>
            )}

            <label className="form-field">
              Movement Type
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  setSuccess("");
                  setError("");
                  setReason(
                    event.target.value === "IN" ? "Purchase" : "Sale"
                  );
                }}
              >
                <option value="IN">Stock In — Add quantity</option>
                <option value="OUT">Stock Out — Remove quantity</option>
              </select>
            </label>

            <label className="form-field">
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </label>

            <label className="form-field">
              Reason
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              >
                <option>Purchase</option>
                <option>Sale</option>
                <option>Customer Return</option>
                <option>Damaged Stock</option>
                <option>Internal Use</option>
                <option>Stock Correction</option>
              </select>
            </label>

            <button
              className="btn-primary movement-submit"
              type="submit"
              disabled={saving || loading || !products.length}
            >
              {type === "IN" ? (
                <ArrowDownToLine size={18} />
              ) : (
                <ArrowUpFromLine size={18} />
              )}
              {saving
                ? "Recording..."
                : type === "IN"
                  ? "Record Stock In"
                  : "Record Stock Out"}
            </button>
          </form>
        </section>

        <section
          className="content-card movement-history-card"
          id="movement-history"
        >
          <div className="section-heading">
            <div>
              <h2>Movement History</h2>
              <p>Latest stock transactions</p>
            </div>
            <span className="history-count">
              {movements.length} records
            </span>
          </div>

          {loading ? (
            <div className="empty-state">Loading history...</div>
          ) : movements.length === 0 ? (
            <div className="empty-state">
              <History size={28} />
              <strong>No movements yet</strong>
              <span>Record your first stock movement.</span>
            </div>
          ) : (
            <div className="movement-list">
              {movements.map((movement) => (
                <article className="movement-item" key={movement._id}>
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
                      {movement.reason} · {formatDate(movement.createdAt)}
                    </span>
                    <small>
                      Balance after: {movement.balanceAfter} units
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
      </div>
    </div>
  );
}
