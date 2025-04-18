import { fetch } from "../utility/fetch.js";

export async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
