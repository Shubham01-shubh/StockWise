
import { Eye, Pencil, Trash2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <Package size={30} />
        <strong>No products found</strong>
        <span>Try another search or add your first product.</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="inventory-table products-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const isLowStock =
              Number(product.quantity) <=
              Number(product.lowStockThreshold ?? 5);

            return (
              <tr key={product._id}>
                <td className="product-name">{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.category}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.quantity}</td>

                <td>
                  <span
                    className={`status-badge ${
                      isLowStock ? "low" : "in-stock"
                    }`}
                  >
                    {isLowStock ? "Low stock" : "In stock"}
                  </span>
                </td>

                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="action-button"
                      onClick={() =>
                        navigate(`/products/${product._id}`)
                      }
                      title="View product details"
                      aria-label={`View details for ${product.name}`}
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      type="button"
                      className="action-button edit-action"
                      onClick={() => onEdit(product)}
                      title="Edit product"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      className="action-button delete-action"
                      onClick={() => onDelete(product)}
                      title="Delete product"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
