# StockWise — Inventory & Stock Management System

A full-stack MERN application for managing products, monitoring inventory levels, recording stock movements, maintaining supplier information, and generating inventory reports.

## Project Overview

StockWise helps users manage inventory through a centralized dashboard. It provides product and supplier management, stock-in and stock-out tracking, low-stock alerts, and downloadable CSV reports.

This project was developed as a proof of concept for Full Stack Development using the MERN stack.

## Objectives

- Implement CRUD (Create, Read, Update, Delete) operations.
- Build a responsive user interface using React.
- Develop REST APIs using Node.js and Express.js.
- Store and retrieve application data using MongoDB.
- Integrate the frontend and backend through HTTP requests.
- Track inventory changes and identify products with low stock.

## Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development server and build tool |
| Bootstrap | Styling and responsive layout |
| React Router | Frontend page navigation |
| Node.js | Backend JavaScript runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Lucide React | Icons |
| Postman / curl | API testing |

## Features

### 1. Dashboard
- Displays total products and total stock units.
- Shows inventory value.
- Identifies products with low stock.
- Provides a summary of inventory status.

### 2. Product Management
- Add new products.
- View product details.
- Update existing products.
- Delete products.
- Search products.
- Maintain SKU, category, price, quantity, and low-stock threshold.

### 3. Stock Movement Management
- Record stock-in operations.
- Record stock-out operations.
- Enter the quantity and reason for each movement.
- View stock movement history.
- Prevent stock-out operations when sufficient stock is unavailable.

### 4. Supplier Management
- Add, view, update, and delete supplier records.
- Maintain supplier name, contact person, email, phone, and address.

### 5. Reports & Analytics
- View inventory summaries.
- Generate low-stock and inventory reports.
- Review recent stock movements.
- Export inventory, low-stock, and movement data as CSV files.

## Project Structure

```text
StockWise/
├── README.md
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    ├── models/
    ├── routes/
    ├── .env
    ├── package.json
    └── server.js
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB Community Server
- Visual Studio Code (recommended)

MongoDB Compass can optionally be used to inspect the database.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd StockWise
```

Replace the placeholder with your actual repository URL.

### 2. Configure the backend

Open a terminal in the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/StockWise?retryWrites=false
```

Ensure your local MongoDB server is running.

### 3. Start the backend

From the `server` directory, run:

```bash
npm start
```

Use `npm run dev` instead if your backend `package.json` defines a development script.

The API runs at:

`http://localhost:5000`

### 4. Configure the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create or verify `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the frontend

From the `client` directory:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal, usually:

`http://localhost:5173`

## API Endpoints

Base URL: `http://localhost:5000/api`

### Products

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products` | Retrieve all products |
| GET | `/products/:id` | Retrieve a product by ID |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

### Stock Movements

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/movements` | Retrieve stock movement history |
| POST | `/movements` | Record a stock-in or stock-out operation |

### Suppliers

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/suppliers` | Retrieve all suppliers |
| GET | `/suppliers/:id` | Retrieve a supplier by ID |
| POST | `/suppliers` | Create a supplier |
| PUT | `/suppliers/:id` | Update a supplier |
| DELETE | `/suppliers/:id` | Delete a supplier |

## Database

The application uses MongoDB with Mongoose models for:

- **Product:** product name, SKU, category, price, quantity, and low-stock threshold.
- **StockMovement:** product reference, movement type, quantity, reason, and resulting stock balance.
- **Supplier:** supplier name and contact information.

Database name: `StockWise`

## Testing Checklist

- [ ] Create, view, update, and delete products.
- [ ] Search for products.
- [ ] Record stock-in operations.
- [ ] Record stock-out operations.
- [ ] Verify that stock cannot become negative.
- [ ] Add, update, and delete suppliers.
- [ ] Check dashboard totals and low-stock indicators.
- [ ] Verify reports and CSV exports.
- [ ] Test API endpoints and validation errors.
- [ ] Confirm that frontend changes are reflected in MongoDB.

## Future Enhancements

- User authentication and role-based access control.
- Supplier-product association and purchase orders.
- Advanced analytics and graphical reports.
- Barcode scanning and automated stock alerts.
- Deployment to a cloud hosting platform.

## Conclusion

StockWise demonstrates the integration of React, Node.js, Express.js, and MongoDB to create a practical inventory management application. It provides CRUD functionality, stock movement tracking, supplier management, and reporting in a single interface.

**Project:** StockWise — Inventory & Stock Management System  
**Project Type:** Full Stack Development Proof of Concept  
**Technology:** MERN Stack