// app/admin/products/add/page.tsx
'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProductFormModal, BaseProductFormValues } from '@/components/products/ProductForm';

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = async (values: BaseProductFormValues) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      
      if (result.success) {
        // Redirect to products page after successful creation
        router.push('/product');
      } else {
        alert(result.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          </div>
          <div className="p-2 hover:bg-gray-100 rounded-lg transition">
            <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />
          </div>
        </header>

        {/* Reuse the same product form in "page" layout style */}
        <div className="p-8 flex justify-center">
          <div className="w-full max-w-xl">
            <ProductFormModal
              mode="add"
              isOpen={true}
              onClose={() => router.back()}
              initialValues={{
                category: 'subscription',
                image: '🍱',
              }}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
