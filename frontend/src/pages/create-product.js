import { useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import { createProduct, uploadProductImage } from '../services/productCreationService';

export default function CreateProductPage({ onLogout, onBack, onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'MAD',
    category: 'AUTRE',
    city: '',
    phoneNumber: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim() || !formData.city.trim() || !formData.phoneNumber.trim()) {
      setError('Remplissez tous les champs obligatoires');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Le prix doit être supérieur à 0');
      return;
    }

    setLoading(true);

    try {
      // Créer le produit
      const product = await createProduct({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        category: formData.category,
        city: formData.city,
        phoneNumber: formData.phoneNumber,
      });

      // Uploader l'image si présente
      if (imageFile && product.id) {
        try {
          const imageResult = await uploadProductImage(product.id, imageFile);
          console.log('✅ Image uploaded successfully:', imageResult);
        } catch (imgErr) {
          console.error('❌ Image upload failed:', imgErr.message);
          setError(`Produit créé, mais erreur lors de l'upload de l'image: ${imgErr.message}`);
          setLoading(false);
          return;
        }
      }

      setSuccess('✅ Produit créé avec succès!');
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'MAD',
        category: 'AUTRE',
        city: '',
        phoneNumber: '',
      });
      setImageFile(null);
      setImagePreview(null);

      // Redirection après 2 secondes
      setTimeout(() => {
        onNavigate('shop');
      }, 2000);
    } catch (err) {
      setError(`❌ ${err.message || 'Erreur lors de la création du produit'}`);
    } finally {
      setLoading(false);
    }
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

        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-sm font-medium transition"
        >
          ← Retour
        </button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-red-300">📝 Créer un Produit</h1>

          <div className="bg-red-800/60 backdrop-blur-sm rounded-lg p-6 border border-red-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Maillot PSG 2024"
                  className="w-full px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre produit..."
                  rows="4"
                  className="w-full px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prix *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Devise</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="MAD">MAD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="MAILLOTS">Maillots</option>
                  <option value="TICKETS">Tickets</option>
                  <option value="ACCESSOIRES">Accessoires</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>

              {/* City & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ville *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ex: Casablanca"
                    className="w-full px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Ex: 0612345678"
                    className="w-full px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Image du produit</label>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="flex-1 px-3 py-2 bg-red-900/50 border border-red-700 rounded text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:file:bg-purple-700"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-4 rounded overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900 border border-red-700 rounded p-3 text-red-100">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-900 border border-green-700 rounded p-3 text-green-100">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded transition"
                >
                  {loading ? '⏳ Création...' : '✨ Créer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
