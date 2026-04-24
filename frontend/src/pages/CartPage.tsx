import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQty, cartTotal, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tax = cartTotal * 0.18; // 18% GST
  const shipping = cartTotal > 0 ? 50 : 0;
  const grandTotal = cartTotal + tax + shipping;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue to checkout');
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-white py-20 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h2 className="font-playfair text-3xl text-midnight mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/products"
          className="bg-gold text-midnight px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-yellow-500 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="mb-12">
          <h1 className="font-playfair text-4xl text-midnight mb-2">Shopping Cart</h1>
          <p className="text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="bg-white border border-gray-100 p-6">
              <div className="hidden md:grid grid-cols-6 gap-4 border-b border-gray-100 pb-4 mb-6 text-sm uppercase tracking-wider text-gray-400 font-medium">
                <div className="col-span-3">Product</div>
                <div className="col-span-1 text-center">Price</div>
                <div className="col-span-1 text-center">Quantity</div>
                <div className="col-span-1 text-right">Total</div>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex flex-col md:grid md:grid-cols-6 gap-4 items-center border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    {/* Mobile Delete */}
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="md:hidden self-end text-gray-400 hover:text-red-500 transition-colors mb-2"
                    >
                      <X size={20} />
                    </button>
                    
                    <div className="col-span-3 flex w-full md:w-auto items-center gap-4">
                      <Link to={`/products/${item.product.id}`} className="w-24 h-24 flex-shrink-0 bg-gray-100 block">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </Link>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.product.category}</p>
                        <Link to={`/products/${item.product.id}`} className="font-playfair text-lg text-midnight hover:text-gold transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                      </div>
                    </div>
                    
                    <div className="col-span-1 text-center hidden md:block text-gray-600">
                      ₹{item.product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    
                    <div className="col-span-1 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                      <div className="flex items-center border border-gray-300">
                        <button 
                          onClick={() => updateQty(item.product.id, item.quantity - 1)}
                          className="p-2 text-gray-500 hover:text-midnight transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.product.id, item.quantity + 1)}
                          className="p-2 text-gray-500 hover:text-midnight transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 flex justify-between md:justify-end items-center w-full md:w-auto mt-4 md:mt-0">
                      <span className="md:hidden text-gray-500">Total:</span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-midnight">
                          ₹{(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="hidden md:block text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <Link to="/products" className="text-midnight uppercase tracking-wider text-sm font-medium hover:text-gold transition-colors flex items-center">
                <ArrowLeft size={16} className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-100 p-6 sticky top-32">
              <h2 className="font-playfair text-2xl text-midnight mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">Shipping Estimate</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">Tax Estimate</span>
                  <span>₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-medium uppercase tracking-wider">Estimated Total</span>
                <span className="text-2xl text-gold font-medium">
                  ₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Gift Card or Discount Code</label>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-1 border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold"
                  />
                  <button className="bg-midnight text-cream-white px-4 py-3 uppercase tracking-wider text-sm hover:bg-black transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full flex items-center justify-center bg-gold text-midnight py-4 uppercase tracking-widest text-sm font-medium hover:bg-yellow-500 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper for ArrowLeft which was missing
const ArrowLeft = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

export default CartPage;
