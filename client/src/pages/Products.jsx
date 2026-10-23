
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Plus,
  Search,
  Package,
  Tags,
  AlertTriangle,
} from "lucide-react";
import {
  useSearchParams,
} from "react-router-dom";

import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get("view") || "all";
  const action = searchParams.get("action");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Open the Add Product modal when selected from the submenu.
  useEffect(() => {
    if (action === "add") {
      setSelectedProduct(null);
      setModalOpen(true);
    }
  }, [action]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category?.trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = [
        product.name,
        product.sku,
        product.category,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const threshold = Number(product.lowStockThreshold ?? 10);

      const matchesView =
        view === "low-stock"
          ? Number(product.quantity ?? 0) <= threshold
          : view === "categories"
            ? Boolean(product.category)
            : true;

      return matchesSearch && matchesView;
    });
  }, [products, search, view]);

  function openAddModal() {
    setSelectedProduct(null);
    setSearchParams({});
    setModalOpen(true);
  }

  function openEditModal(product) {
    setSelectedProduct(product);
    setModalOpen(true);
  }

  async function handleSave(productData) {
    if (selectedProduct) {
      await updateProduct(selectedProduct._id, productData);
    } else {
      await createProduct(productData);
    }

    setModalOpen(false);
    setSelectedProduct(null);
    setSearchParams({});
    await loadProducts();
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteProduct(product._id);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    }
  }

  function selectView(nextView) {
    setSearchParams(
      nextView === "all" ? {} : { view: nextView }
    );
    setSearch("");
  }

  const pageTitle =
    view === "categories"
      ? "Product Categories"
      : view === "low-stock"
        ? "Low-Stock Products"
        : "Products";

  const pageDescription =
    view === "categories"
      ? "Browse products that have a category assigned."
      : view === "low-stock"
        ? "Monitor products that have reached their low-stock threshold."
        : "Manage your product catalog and stock availability.";

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">INVENTORY</span>
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </div>

        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Add Product
        </button>
      </header>

      <section className="product-summary">
        <div className="product-summary-icon">
          <Package size={23} />
        </div>
        <div>
          <span>Total products</span>
          <h2>{products.length}</h2>
        </div>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="content-card products-card">
        <div className="products-toolbar">
          <div>
            <h2>Product Inventory</h2>
            <p>
              {view === "categories"
                ? `${categories.length} categories found`
                : view === "low-stock"
                  ? `${filteredProducts.length} products need attention`
                  : "View and manage all registered products."}
            </p>
          </div>

          <label className="search-box">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search name, SKU or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        <div className="product-view-filters">
          <button
            type="button"
            className={`product-view-button ${
              view === "all" ? "active" : ""
            }`}
            onClick={() => selectView("all")}
          >
            <Package size={16} />
            All Products
          </button>

          <button
            type="button"
            className={`product-view-button ${
              view === "categories" ? "active" : ""
            }`}
            onClick={() => selectView("categories")}
          >
            <Tags size={16} />
            Categories
          </button>

          <button
            type="button"
            className={`product-view-button ${
              view === "low-stock" ? "active" : ""
            }`}
            onClick={() => selectView("low-stock")}
          >
            <AlertTriangle size={16} />
            Low Stock
          </button>
        </div>

        {view === "categories" && categories.length > 0 && (
          <div className="category-list">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className="category-chip"
                onClick={() => setSearch(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="empty-state">Loading products...</div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}

        <div className="table-footer">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </section>

      <ProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);

          if (action === "add") {
            setSearchParams({});
          }
        }}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  );
}
