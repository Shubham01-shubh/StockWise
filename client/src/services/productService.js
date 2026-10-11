
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const getProducts = () => request("/products");

export const getProduct = (id) => request(`/products/${id}`);

export const createProduct = (product) =>
  request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

export const updateProduct = (id, product) =>
  request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

export const deleteProduct = (id) =>
  request(`/products/${id}`, {
    method: "DELETE",
  });
