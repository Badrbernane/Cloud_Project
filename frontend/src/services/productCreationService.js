import { API_CONFIG } from '../config/config';

const MARKETPLACE_API_URL = `${API_CONFIG.MARKETPLACE_SERVICE}/api/market/products`;

export const createProduct = async (productData) => {
  try {
    const userId = localStorage.getItem('userId');
    
    const response = await fetch(MARKETPLACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'X-User-Id': userId } : {}),
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error creating product:', error);
    throw error;
  }
};

export const uploadProductImage = async (productId, imageFile) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User not logged in');
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(
      `${MARKETPLACE_API_URL}/${productId}/images?sellerId=${userId}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Image upload failed: ${text || `HTTP ${response.status}`}`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw error;
  }
};

export default { createProduct, uploadProductImage };
