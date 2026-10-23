
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  IndianRupee,
  Boxes,
  AlertTriangle,
  Search,
  Eye,
} from "lucide-react";
import { getProducts } from "../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load product details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const product = products.find((item) => item._id === id);

  const filteredProducts = products.filter((item) => {
    const query = search.trim().toLowerCase();

    return [
      item.name,
      item.sku,
      item.category,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(query)
    );
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const isLowStock = (item) =>
    Number(item.quantity || 0) <=
    Number(item.lowStockThreshold ?? 5);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="empty-state">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <button
          className="btn-secondary"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>
        <div className="error-banner">{error}</div>
      </div>
    );
  }

  // Individual product details
  if (id) {
    if (!product) {
      return (
        <div className="dashboard-page">
          <button
            className="btn-secondary"
            onClick={() => navigate("/products/details")}
          >
            <ArrowLeft size={16} />
            Back to Product Details
          </button>

          <div className="empty-state">
            <Package size={30} />
            <strong>Product not found</strong>
            <span>This product may have been deleted.</span>
          </div>
        </div>
      );
    }

    const lowStock = isLowStock(product);

    return (
      <div className="dashboard-page">
        <header className="topbar">
          <div>
            <span className="eyebrow">PRODUCT CATALOG</span>
            <h1>Product Details</h1>
            <p>Complete information about this product.</p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => navigate("/products/details")}
          >
            <ArrowLeft size={16} />
            All Product Details
          </button>
        </header>

        <section className="content-card product-details-card">
          <div className="product-details-heading">
            <div className="product-details-icon">
              <Package size={30} />
            </div>

            <div>
              <h2>{product.name}</h2>
              <p>SKU: {product.sku || "—"}</p>
            </div>

            <span
              className={`status-badge ${
                lowStock ? "low" : "in-stock"
              }`}
            >
              {lowStock ? "Low stock" : "In stock"}
            </span>
          </div>

          <div className="product-details-grid">
            <article className="product-detail-item">
              <span>Category</span>
              <strong>{product.category || "—"}</strong>
            </article>

            <article className="product-detail-item">
              <span>Unit Price</span>
              <strong>{formatCurrency(product.price)}</strong>
            </article>

            <article className="product-detail-item">
              <span>Available Quantity</span>
              <strong>{product.quantity ?? 0} units</strong>
            </article>

            <article className="product-detail-item">
              <span>Low-Stock Threshold</span>
              <strong>{product.lowStockThreshold ?? 5} units</strong>
            </article>

            <article className="product-detail-item">
              <span>Total Inventory Value</span>
              <strong>
                {formatCurrency(
                  Number(product.price || 0) *
                    Number(product.quantity || 0)
                )}
              </strong>
            </article>

            <article className="product-detail-item">
              <span>Stock Status</span>
              <strong className={lowStock ? "detail-warning" : ""}>
                {lowStock ? (
                  <>
                    <AlertTriangle size={16} />
                    Low stock
                  </>
                ) : (
                  "Sufficient stock"
                )}
              </strong>
            </article>
          </div>

          <div className="product-details-actions">
            <button
              className="btn-secondary"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </button>

            <button
              className="btn-primary"
              onClick={() => navigate("/stock")}
            >
              <Boxes size={17} />
              Manage Stock
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Product Details submenu: searchable list of products
  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">PRODUCT CATALOG</span>
          <h1>Product Details</h1>
          <p>Select a product to view its complete information.</p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>
      </header>

      <section className="content-card">
        <div className="products-toolbar">
          <div>
            <h2>Browse Products</h2>
            <p>{products.length} products available</p>
          </div>

          <label className="search-box">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={30} />
            <strong>No products found</strong>
            <span>
              {search
                ? "Try a different search term."
                : "Add products to view their details here."}
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
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item._id}>
                    <td className="product-name">{item.name}</td>
                    <td>{item.sku || "—"}</td>
                    <td>{item.category || "—"}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{item.quantity ?? 0}</td>
                    <td>
                      <button
                        type="button"
                        className="action-button"
                        title={`View ${item.name}`}
                        aria-label={`View details for ${item.name}`}
                        onClick={() =>
                          navigate(`/products/${item._id}`)
                        }
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
