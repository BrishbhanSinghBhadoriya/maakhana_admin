'use client';

import React from 'react';
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ArrowUp,
  LucideIcon,
  X,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'Delivered' | 'Processing' | 'Shipped';
  date: string;
}

interface Product {
  name: string;
  sales: number;
  revenue: string;
  trend: string;
}

export default function MakhanaDashboard(): React.ReactElement {
  const stats: StatCard[] = [
    {
      title: 'Total Sales',
      value: '₹1,28,430',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Total Orders',
      value: '1,024',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Total Customers',
      value: '2,845',
      change: '+5.1%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Total Products',
      value: '486',
      change: '+3.2%',
      trend: 'up',
      icon: Package,
      color: 'orange'
    }
  ];

  const [orders, setOrders] = React.useState<Order[]>([
    { id: '#ORD-001', customer: 'Rahul Sharma', product: 'Peri Peri Makhana', amount: '₹349', status: 'Delivered', date: '05 Jan 2026' },
    { id: '#ORD-002', customer: 'Priya Singh', product: 'Plain Roasted', amount: '₹299', status: 'Processing', date: '05 Jan 2026' },
    { id: '#ORD-003', customer: 'Amit Kumar', product: 'Pudina Makhana', amount: '₹329', status: 'Shipped', date: '04 Jan 2026' },
    { id: '#ORD-004', customer: 'Neha Gupta', product: 'Cream & Onion', amount: '₹339', status: 'Delivered', date: '04 Jan 2026' },
    { id: '#ORD-005', customer: 'Vikram Rao', product: 'Peri Peri Makhana', amount: '₹698', status: 'Processing', date: '03 Jan 2026' }
  ]);

  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = React.useState<Order | null>(null);

  const handleView = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order) setSelectedOrder(order);
  };

  const handleEdit = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order) setEditingOrder({ ...order });
  };

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter(order => order.id !== id));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders((prev) => prev.map((o) => (o.id === editingOrder.id ? editingOrder : o)));
      setEditingOrder(null);
    }
  };

  const topProducts: Product[] = [
    { name: 'Peri Peri Makhana', sales: 245, revenue: '₹85,505', trend: '+15%' },
    { name: 'Plain Roasted', sales: 198, revenue: '₹59,202', trend: '+12%' },
    { name: 'Pudina Makhana', sales: 167, revenue: '₹54,943', trend: '+8%' },
    { name: 'Cream & Onion', sales: 134, revenue: '₹45,426', trend: '+5%' }
  ];

  const getStatusColor = (status: Order['status']): string => {
    switch(status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getColorClass = (color: StatCard['color']): string => {
    switch(color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getIconColor = (color: StatCard['color']): string => {
    switch(color) {
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'purple': return 'text-purple-500';
      case 'orange': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Last updated: Today at 09:41 AM</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${getColorClass(stat.color)} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${getIconColor(stat.color)}`} />
              </div>
              <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                <ArrowUp className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-2">from last month</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Overview Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Sales Overview</h3>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 rounded-lg">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">Chart visualization would appear here</p>
              <p className="text-sm text-gray-400">Using Chart.js or Recharts in production</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">{product.revenue}</p>
                  <p className="text-xs text-green-600">{product.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button className="text-orange-600 font-medium text-sm hover:text-orange-700">
              View All
            </button>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button onClick={() => handleView(order.id)} className="p-1 hover:bg-blue-50 rounded text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(order.id)} className="p-1 hover:bg-green-50 rounded text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="p-1 hover:bg-red-50 rounded text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <div key={index} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Customer:</span> {order.customer}</p>
                  <p><span className="font-medium">Product:</span> {order.product}</p>
                  <p><span className="font-medium">Amount:</span> {order.amount}</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleView(order.id)} className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" /> View
                  </button>
                  <button onClick={() => handleEdit(order.id)} className="flex-1 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-lg flex items-center justify-center gap-1">
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(order.id)} className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg flex items-center justify-center gap-1">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Order ID</span>
                <span className="font-medium text-gray-900">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Date</span>
                <span className="font-medium text-gray-900">{selectedOrder.date}</span>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Info</h4>
                <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {selectedOrder.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.customer}</p>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Product Details</h4>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Product</span>
                    <span className="text-sm font-medium text-gray-900">{selectedOrder.product}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-sm font-bold text-gray-900">{selectedOrder.amount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Edit Order</h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editingOrder.customer}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <input
                    type="text"
                    value={editingOrder.product}
                    onChange={(e) => setEditingOrder({ ...editingOrder, product: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="text"
                    value={editingOrder.amount}
                    onChange={(e) => setEditingOrder({ ...editingOrder, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}