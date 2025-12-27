import { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import { getAllProducts } from '../services/marketplaceService';

export default function MarketplacePage({ onLogout, onBack, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ q: '', category: '' });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (filterParams = {}) => {
    setIsLoading(true);
    setError('');
    try {
      const allProducts = await getAllProducts(filterParams);
      setProducts(Array.isArray(allProducts) ? allProducts : []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les produits');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(filters);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: "url('/images/ar.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} />
      <div className="ml-20 p-4">
        <Navbar onProfileClick={() => onNavigate('profile')} />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-sm font-medium transition"
        >
          ← Retour
        </button>

        {/* Title & Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-red-300">🛍️ Marketplace</h1>
          <button
            onClick={() => onNavigate('createProduct')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-medium transition"
          >
            ➕ Créer un Produit
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-red-800/50 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="flex-1 min-w-64 px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
            />
            <select
              className="px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              <option value="ELECTRONICS">Électronique</option>
              <option value="CLOTHING">Vêtements</option>
              <option value="HOME">Maison</option>
              <option value="SPORTS">Sports</option>
              <option value="OTHER">Autre</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded font-medium transition"
            >
              🔍 Rechercher
            </button>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-red-800 rounded-lg p-8 text-center text-white">
            <p className="text-lg">⏳ Chargement des produits...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 rounded-lg p-4 mb-4 text-white border border-red-700">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="bg-red-800 rounded-lg p-8 text-center text-white">
            <p className="text-xl font-semibold mb-2">📭 Aucun produit trouvé</p>
            <p className="text-red-200">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="bg-red-800/60 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105 cursor-pointer border border-red-700">
      {/* Image */}
      <div className="w-full h-48 bg-red-900/50 overflow-hidden">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <img
            src={product.imageUrls[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-red-400">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.title}</h3>
        
        <p className="text-sm text-red-200 mb-3 line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-purple-400">
            {product.price?.toFixed(2)} {product.currency || 'MAD'}
          </p>
        </div>

        {/* Category & City */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {product.category && (
            <span className="px-2 py-1 text-xs bg-purple-600/60 rounded text-white">
              {product.category}
            </span>
          )}
          {product.city && (
            <span className="px-2 py-1 text-xs bg-blue-600/60 rounded text-white">
              📍 {product.city}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="mb-3">
          <span
            className={`px-3 py-1 text-xs rounded font-medium ${
              product.status === 'AVAILABLE'
                ? 'bg-green-600/60 text-green-100'
                : 'bg-gray-600/60 text-gray-100'
            }`}
          >
            {product.status === 'AVAILABLE' ? '✓ Disponible' : 'Vendu'}
          </span>
        </div>

        {/* Contact */}
        {product.phoneNumber && (
          <div className="pt-3 border-t border-red-700">
            <p className="text-xs text-red-300 mb-2">Contactez le vendeur:</p>
            <a
              href={`tel:${product.phoneNumber}`}
              className="block w-full text-center px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition"
            >
              ☎️ {product.phoneNumber}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
