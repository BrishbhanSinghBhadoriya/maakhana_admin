// app/admin/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { ProductFormModal, BaseProductFormValues } from '@/components/products/ProductForm';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  dailyCost?: string;
  category: string;
  mealType?: string;
  day?: string;
  items?: string[];
  kitchenCost?: string;
  image: string;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'subscriptions' | 'breakfast' | 'lunch' | 'dinner'>('subscriptions');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const result = await response.json();
        
        if (result.success) {
          setAllProducts(result.data);
          setError(null);
        } else {
          setError(result.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper functions to get products by category
  const subscriptions = allProducts.filter(p => p.category === 'subscription');
  const breakfastMenu = allProducts.filter(p => p.category === 'breakfast');
  const lunchMenu = allProducts.filter(p => p.category === 'lunch');
  const dinnerMenu = allProducts.filter(p => p.category === 'dinner');
  const nonVegAddons = allProducts.filter(p => p.category === 'nonveg');
  const gymPackItems = allProducts.filter(p => p.category === 'gym');

  const getCurrentProducts = () => {
    switch(viewMode) {
      case 'subscriptions':
        return subscriptions;
      case 'breakfast':
        return breakfastMenu;
      case 'lunch':
        return lunchMenu;
      case 'dinner':
        return [...dinnerMenu, ...nonVegAddons];
      default:
        return subscriptions;
    }
  };

  const filteredProducts = getCurrentProducts().filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openFormForAdd = () => {
    setFormMode('add');
    setActiveProduct(null);

    // Pre-select sensible defaults based on current view
    const defaultCategory =
      viewMode === 'subscriptions'
        ? 'subscription'
        : viewMode === 'breakfast'
        ? 'breakfast'
        : viewMode === 'lunch'
        ? 'lunch'
        : 'dinner';

    setIsFormOpen(true);
  };

  const openFormForEdit = (product: Product) => {
    setFormMode('edit');
    setActiveProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: BaseProductFormValues) => {
    try {
      if (formMode === 'add') {
        // Create new product
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();
        
        if (result.success) {
          // Refresh products list
          const refreshResponse = await fetch('/api/products');
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success) {
            setAllProducts(refreshResult.data);
          }
          setIsFormOpen(false);
        } else {
          alert(result.error || 'Failed to create product');
        }
      } else {
        // Update existing product
        if (!activeProduct) return;
        
        const response = await fetch(`/api/products/${activeProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();
        
        if (result.success) {
          // Refresh products list
          const refreshResponse = await fetch('/api/products');
          const refreshResult = await refreshResponse.json();
          if (refreshResult.success) {
            setAllProducts(refreshResult.data);
          }
          setIsFormOpen(false);
        } else {
          alert(result.error || 'Failed to update product');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh products list
        const refreshResponse = await fetch('/api/products');
        const refreshResult = await refreshResponse.json();
        if (refreshResult.success) {
          setAllProducts(refreshResult.data);
        }
      } else {
        alert(result.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🍱</div>
              <h1 className="text-2xl font-bold text-gray-900">MaaKhana</h1>
            </div>
            <button
              onClick={openFormForAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              <span>Add New Product</span>
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setViewMode('subscriptions')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                viewMode === 'subscriptions'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📦 Subscription Plans ({subscriptions.length})
            </button>
            <button
              onClick={() => setViewMode('breakfast')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                viewMode === 'breakfast'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🌅 Breakfast Menu ({breakfastMenu.length})
            </button>
            <button
              onClick={() => setViewMode('lunch')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                viewMode === 'lunch'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ☀️ Lunch Menu ({lunchMenu.length})
            </button>
            <button
              onClick={() => setViewMode('dinner')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                viewMode === 'dinner'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🌙 Dinner Menu ({dinnerMenu.length + nonVegAddons.length})
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="subscription">Subscriptions</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="nonveg">Non-Veg</option>
              <option value="gym">Gym Pack</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{product.image}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.category === 'subscription' ? 'bg-purple-100 text-purple-700' :
                    product.category === 'breakfast' ? 'bg-yellow-100 text-yellow-700' :
                    product.category === 'lunch' ? 'bg-orange-100 text-orange-700' :
                    product.category === 'dinner' ? 'bg-blue-100 text-blue-700' :
                    product.category === 'nonveg' ? 'bg-red-100 text-red-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {product.category.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                {product.day && (
                  <p className="text-sm text-blue-600 font-medium mb-2">📅 {product.day}</p>
                )}
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>

                {product.items && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.items.map((item, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
                    {product.dailyCost && (
                      <p className="text-xs text-gray-500">{product.dailyCost}</p>
                    )}
                    {product.kitchenCost && (
                      <p className="text-xs text-green-600">Cost: {product.kitchenCost}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openFormForEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Menu Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{subscriptions.length}</p>
              <p className="text-sm text-gray-600">Subscription Plans</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{breakfastMenu.length}</p>
              <p className="text-sm text-gray-600">Breakfast Items</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{lunchMenu.length}</p>
              <p className="text-sm text-gray-600">Lunch Items</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{dinnerMenu.length}</p>
              <p className="text-sm text-gray-600">Dinner Items</p>
            </div>
          </div>
        </div>
      </div>

      <ProductFormModal
        mode={formMode}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialValues={
          formMode === 'add'
            ? {
                category:
                  viewMode === 'subscriptions'
                    ? 'subscription'
                    : viewMode === 'breakfast'
                    ? 'breakfast'
                    : viewMode === 'lunch'
                    ? 'lunch'
                    : 'dinner',
                mealType: viewMode === 'subscriptions' ? '' : viewMode,
              }
            : activeProduct ?? undefined
        }
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}