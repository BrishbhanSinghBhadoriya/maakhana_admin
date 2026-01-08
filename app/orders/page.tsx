'use client';
import React, { useState } from 'react';
import { Search, Eye, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
  id: number;
  orderId: string;
  customerName: string;
  email: string;
  items: string[];
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  address: string;
}

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const orders: Order[] = [
    {
      id: 1,
      orderId: 'ORD-2025-001',
      customerName: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      items: ['Standard Veg Plan', 'Breakfast x7'],
      totalAmount: 2310,
      orderDate: '2025-01-05',
      deliveryDate: '2025-01-07',
      status: 'processing',
      paymentStatus: 'paid',
      address: 'A-204, Green Valley, Sector 12, Noida'
    },
    {
      id: 2,
      orderId: 'ORD-2025-002',
      customerName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      items: ['Gym Bro Pack - Non-Veg'],
      totalAmount: 4095,
      orderDate: '2025-01-04',
      deliveryDate: '2025-01-06',
      status: 'delivered',
      paymentStatus: 'paid',
      address: 'B-102, Sunflower Apartments, Dwarka, Delhi'
    },
    {
      id: 3,
      orderId: 'ORD-2025-003',
      customerName: 'Amit Patel',
      email: 'amit.patel@example.com',
      items: ['Standard Non-Veg Plan', 'Lunch x7', 'Dinner x7'],
      totalAmount: 2730,
      orderDate: '2025-01-03',
      deliveryDate: '2025-01-05',
      status: 'delivered',
      paymentStatus: 'paid',
      address: 'C-501, Royal Residency, Gurgaon'
    },
    {
      id: 4,
      orderId: 'ORD-2025-004',
      customerName: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      items: ['Breakfast x5', 'Lunch x5'],
      totalAmount: 800,
      orderDate: '2025-01-06',
      deliveryDate: '2025-01-08',
      status: 'pending',
      paymentStatus: 'unpaid',
      address: 'D-303, Paradise Heights, Greater Noida'
    },
    {
      id: 5,
      orderId: 'ORD-2025-005',
      customerName: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      items: ['Gym Bro Pack - Veg'],
      totalAmount: 3465,
      orderDate: '2025-01-02',
      deliveryDate: '2025-01-04',
      status: 'cancelled',
      paymentStatus: 'refunded',
      address: 'E-101, Lake View Society, Faridabad'
    },
    {
      id: 6,
      orderId: 'ORD-2025-006',
      customerName: 'Meera Reddy',
      email: 'meera.reddy@example.com',
      items: ['Standard Veg Plan', 'Breakfast x7', 'Lunch x7'],
      totalAmount: 2310,
      orderDate: '2025-01-05',
      deliveryDate: '2025-01-07',
      status: 'processing',
      paymentStatus: 'paid',
      address: 'F-202, Silver Oak Towers, Ghaziabad'
    }
  ];

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'unpaid': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch(status) {
      case 'pending': return <Clock className="inline" size={16} />;
      case 'processing': return <Package className="inline" size={16} />;
      case 'delivered': return <CheckCircle className="inline" size={16} />;
      case 'cancelled': return <XCircle className="inline" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🍱</div>
            <h1 className="text-2xl font-bold text-gray-900">MaaKhana</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h2>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{order.orderId}</div>
                      <div className="text-xs text-gray-500">Ordered: {order.orderDate}</div>
                      <div className="text-xs text-gray-500">Delivery: {order.deliveryDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.map((item: string, idx: number) => (
                        <div key={idx} className="mb-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {orders.filter((o: Order) => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-3xl font-bold text-blue-600">
              {orders.filter((o: Order) => o.status === 'processing').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Delivered</p>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter((o: Order) => o.status === 'delivered').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-purple-600">
              ₹{orders.reduce((sum: number, o: Order) => sum + o.totalAmount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;