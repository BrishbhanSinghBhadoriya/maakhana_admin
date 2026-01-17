'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export type ProductFormMode = 'add' | 'edit';

export interface BaseProductFormValues {
  name: string;
  description: string;
  price: number;
  category: string;
  mealType?: string;
  day?: string;
  dailyCost?: string;
  kitchenCost?: string;
  image?: string;
}

interface ProductFormProps {
  /** Single main parameter: mode decides heading + primary button text + intent */
  mode: ProductFormMode;
  initialValues?: Partial<BaseProductFormValues>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: BaseProductFormValues) => void;
}

const defaultValues: BaseProductFormValues = {
  name: '',
  description: '',
  price: 0,
  category: 'subscription',
  mealType: '',
  day: '',
  dailyCost: '',
  kitchenCost: '',
  image: '🍱',
};

export function ProductFormModal({
  mode,
  initialValues,
  isOpen,
  onClose,
  onSubmit,
}: ProductFormProps): React.ReactElement | null {
  const [values, setValues] = useState<BaseProductFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  useEffect(() => {
    if (isOpen) {
      setValues({
        ...defaultValues,
        ...initialValues,
      });
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={values.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Product name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Price (₹)</label>
              <input
                name="price"
                type="number"
                min={0}
                value={values.price}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Short description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={values.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="subscription">Subscription</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="nonveg">Non-Veg</option>
                <option value="gym">Gym Pack</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Meal Type</label>
              <input
                name="mealType"
                value={values.mealType ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. breakfast"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Day</label>
              <input
                name="day"
                value={values.day ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Monday"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Daily Cost (text)</label>
              <input
                name="dailyCost"
                value={values.dailyCost ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. ₹110-120 per day"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Kitchen Cost (text)</label>
              <input
                name="kitchenCost"
                value={values.kitchenCost ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. ₹42-55"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Emoji / Icon</label>
              <input
                name="image"
                value={values.image ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 🍱"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              {mode === 'add' ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


