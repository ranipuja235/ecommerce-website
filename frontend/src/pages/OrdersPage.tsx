import React, { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import type { Order } from '../types';

// Dummy Orders
const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD-8942-LX',
    date: 'Oct 12, 2025',
    status: 'Delivered',
    total: 4550.00,
    items: [
      { product: { id: '1', name: 'Diamond Solitaire Ring', price: 4500, category: 'jewelry', images: ['https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=2080&auto=format&fit=crop'], description: '', inStock: true, rating: 5, reviewCount: 24 }, quantity: 1 }
    ]
  },
  {
    id: 'ORD-9125-LX',
    date: 'Nov 05, 2025',
    status: 'Shipped',
    total: 1350.00,
    items: [
      { product: { id: '3', name: 'Silk Evening Gown', price: 1200, category: 'fashion', images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop'], description: '', inStock: true, rating: 4.5, reviewCount: 8 }, quantity: 1 }
    ]
  },
  {
    id: 'ORD-9888-LX',
    date: 'Nov 18, 2025',
    status: 'Processing',
    total: 850.00,
    items: [
      { product: { id: '5', name: 'Leather Satchel', price: 850, category: 'fashion', images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2038&auto=format&fit=crop'], description: '', inStock: true, rating: 4.2, reviewCount: 12 }, quantity: 1 }
    ]
  }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setOrders(DUMMY_ORDERS);
      setIsLoading(false);
    }, 800);
  }, []);

  const toggleOrder = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-white">
         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="bg-cream-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        
        <div className="mb-12">
          <h1 className="font-playfair text-4xl text-midnight mb-2">Order History</h1>
          <p className="text-gray-500">Track and manage your past purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-100 p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-midnight mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 overflow-hidden">
                {/* Order Header (Always visible) */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                      <p className="font-medium text-midnight">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date Placed</p>
                      <p className="font-medium text-midnight">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="font-medium text-midnight">₹{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end mt-4 md:mt-0">
                    <div className="flex -space-x-3 mr-6">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                           <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 z-10">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gold transition-colors">
                      {expandedOrder === order.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                    <h4 className="font-medium text-midnight mb-4 uppercase tracking-wider text-sm">Items in this order</h4>
                    <div className="space-y-4 mb-8">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-4 border border-gray-100">
                          <div className="w-16 h-16 bg-gray-100">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-midnight line-clamp-1">{item.product.name}</h5>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-midnight">₹{item.product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-6">
                      <button className="text-midnight uppercase tracking-wider text-xs font-medium flex items-center hover:text-gold transition-colors">
                        <ExternalLink size={14} className="mr-2" />
                        View Invoice
                      </button>
                      <button className="bg-midnight text-gold px-6 py-3 uppercase tracking-wider text-xs font-medium hover:bg-black transition-colors">
                        Track Package
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
