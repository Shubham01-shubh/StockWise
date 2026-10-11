
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Truck,
  BarChart3,
  Settings,
  Boxes,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Stock Movement", path: "/stock", icon: ArrowLeftRight },
  { name: "Suppliers", path: "/suppliers", icon: Truck },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Boxes size={23} />
        </div>
        <div>
          <h2>StockWise</h2>
          <span>Inventory Management</span>
        </div>
      </div>

      <div className="menu-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <Settings size={18} />
        <span>StockWise v1.0</span>
      </div>
    </aside>
  );
}
