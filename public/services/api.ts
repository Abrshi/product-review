// services/productService.ts
import axios from 'axios';

const API_URL = 'https://your-api-endpoint.com'; // Replace with your API base URL

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;  // Assuming the response contains an array of products
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};
