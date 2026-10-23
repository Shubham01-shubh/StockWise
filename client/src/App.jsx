
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import StockMovement from "./pages/StockMovement";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/products" element={<Products />} />

            {/* Product Details submenu page */}
            <Route
              path="/products/details"
              element={<ProductDetails />}
            />

            {/* Details for an individual product */}
            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            <Route path="/stock" element={<StockMovement />} />

            <Route path="/suppliers" element={<Suppliers />} />

            <Route path="/reports" element={<Reports />} />

            <Route
              path="*"
              element={
                <div className="placeholder-page">
                  <h1>Page not found</h1>
                  <p>The requested page does not exist.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
