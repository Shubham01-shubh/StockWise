
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Package } from "lucide-react";
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

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) =>
      [product.name, product.sku, product.category].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [products, search]);

  function openAddModal() {
    setSelectedProduct(null);
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

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <span className="eyebrow">INVENTORY</span>
          <h1>Products</h1>
          <p>Manage your product catalog and stock availability.</p>
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
            <p>View and manage all registered products.</p>
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
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  );
}
