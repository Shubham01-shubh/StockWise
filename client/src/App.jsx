
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
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
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Product Management */}
            <Route path="/products" element={<Products />} />

            {/* Stock Movement Management */}
            <Route path="/stock" element={<StockMovement />} />

            {/* Supplier Management */}
            <Route path="/suppliers" element={<Suppliers />} />

            {/* Reports and Analytics */}
            <Route path="/reports" element={<Reports />} />

            {/* Fallback for unimplemented pages */}
            <Route
              path="*"
              element={
                <div className="placeholder-page">
                  <h1>Coming soon</h1>
                  <p>
                    This module will be added in a later step.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
