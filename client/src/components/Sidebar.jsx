
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Truck,
  BarChart3,
  Boxes,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Products", path: "/products", icon: Package },
  { name: "Suppliers", path: "/suppliers", icon: Truck },
  {
    name: "Stock Management",
    path: "/stock",
    icon: ArrowLeftRight,
  },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

const subMenus = {
  "/": [
    { name: "Overview", path: "/" },
    { name: "Inventory Summary", path: "/#inventory-summary" },
    { name: "Low-Stock Summary", path: "/#low-stock" },
    { name: "Recent Activity", path: "/#recent-activity" },
  ],
  "/products": [
    { name: "All Products", path: "/products" },
    { name: "Add Product", path: "/products?action=add" },
    { name: "Product Details", path: "/products/details" },
    { name: "Categories", path: "/products?view=categories" },
    { name: "Low-Stock Products", path: "/products?view=low-stock" },
  ],
  "/suppliers": [
    { name: "All Suppliers", path: "/suppliers" },
    { name: "Add Supplier", path: "/suppliers?action=add" },
  ],
  "/stock": [
    { name: "Stock Overview", path: "/stock" },
    { name: "Stock In", path: "/stock?type=IN" },
    { name: "Stock Out", path: "/stock?type=OUT" },
    {
      name: "Movement History",
      path: "/stock#movement-history",
    },
  ],
  "/reports": [
    { name: "Inventory Report", path: "/reports" },
    {
      name: "Low-Stock Report",
      path: "/reports#low-stock-report",
    },
    {
      name: "Movement Report",
      path: "/reports#movement-report",
    },
  ],
};

function getActiveModule(pathname) {
  return (
    menuItems.find((item) =>
      item.path === "/"
        ? pathname === "/"
        : pathname.startsWith(item.path)
    )?.path || "/"
  );
}

function isSubMenuActive(itemPath, location) {
  const hashIndex = itemPath.indexOf("#");
  const pathWithoutHash =
    hashIndex === -1 ? itemPath : itemPath.slice(0, hashIndex);
  const targetHash =
    hashIndex === -1 ? "" : itemPath.slice(hashIndex);

  const queryIndex = pathWithoutHash.indexOf("?");
  const targetPath =
    queryIndex === -1
      ? pathWithoutHash
      : pathWithoutHash.slice(0, queryIndex);
  const targetSearch =
    queryIndex === -1 ? "" : pathWithoutHash.slice(queryIndex);

  if (targetPath !== location.pathname) return false;

  const targetParams = new URLSearchParams(targetSearch);
  const currentParams = new URLSearchParams(location.search);

  return (
    targetParams.toString() === currentParams.toString() &&
    targetHash === location.hash
  );
}

export default function Sidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeModule = getActiveModule(location.pathname);
  const currentSubMenu = subMenus[activeModule] || [];

  const activeModuleName =
    menuItems.find((item) => item.path === activeModule)?.name ||
    "Dashboard";

  return (
    <header className="top-navigation">
      <div className="top-navigation-main">
        <NavLink
          to="/"
          className="top-brand"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="top-brand-icon">
            <Boxes size={24} />
          </span>

          <span className="top-brand-text">
            <strong>CargoCore</strong>
            <small>Inventory Management</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`primary-nav ${
            mobileMenuOpen ? "mobile-open" : ""
          }`}
          aria-label="Main navigation"
        >
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/"}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `primary-nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <span className="top-version">v1.0</span>
      </div>

      <div className="secondary-navigation">
        <div className="secondary-navigation-inner">
          <span className="secondary-menu-label">
            {activeModuleName}
          </span>

          <ChevronRight
            size={15}
            className="secondary-chevron"
          />

          <nav
            className="secondary-nav"
            aria-label={`${activeModuleName} submenu`}
          >
            {currentSubMenu.map((item) => {
              const active = isSubMenuActive(item.path, location);

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`secondary-nav-item ${
                    active ? "active" : ""
                  }`}
                >
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
