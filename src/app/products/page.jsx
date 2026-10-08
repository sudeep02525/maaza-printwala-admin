'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      // In the admin app, axiosInstance is probably configured with base URL
      const response = await axiosInstance.get('/products');
      if (response.success) {
        setProducts(response.data.products);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      if (response.success) {
        fetchProducts(); // Refresh list
      } else {
        alert(response.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  if (isLoading) return <div className="text-slate-500">Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-700">Products Catalogue</h1>
          <p className="text-sm text-slate-600 mt-1 font-normal">Manage all your print products, pricing, and active status.</p>
        </div>
        <Link 
          href="/products/add" 
          className="flex items-center gap-2 bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Product Info</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Base Price (₹)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="py-4 px-6">
                    {product.images && product.images[0] ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                        onError={(e) => { e.target.src = '/placeholder.png' }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700">{product.name}</p>
                    <p className="text-xs text-slate-500 font-normal truncate max-w-[200px]">{product.slug}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{product.category?.name || '-'}</td>
                  <td className="py-4 px-6 font-black text-slate-700">₹{product.basePrice}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.isActive ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                    <Link href={`/products/edit/${product._id}`} className="inline-flex items-center justify-center p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="inline-flex items-center justify-center p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No products found in the catalogue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
