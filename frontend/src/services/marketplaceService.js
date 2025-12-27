import { API_CONFIG } from '../config/config';

const MARKETPLACE_API_URL = `${API_CONFIG.MARKETPLACE_SERVICE}/api/market/products`;

export const getAllProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.q) params.append('q', filters.q);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${MARKETPLACE_API_URL}${query}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${MARKETPLACE_API_URL}/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    throw error;
  }
};

export const getProductsBySeller = async (sellerId) => {
  try {
    const response = await fetch(`${MARKETPLACE_API_URL}/seller/${sellerId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching seller products:', error);
    throw error;
  }
};

export default {
  getAllProducts,
  getProductById,
  getProductsBySeller,
};
