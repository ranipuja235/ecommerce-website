import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Address Form State
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const tax = cartTotal * 0.18;
  const shipping = cartTotal > 0 ? 50 : 0;
  const grandTotal = cartTotal + tax + shipping;

  // Redirect if empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePayment = () => {
    setIsLoading(true);
    // Simulate Razorpay / Payment Gateway
    setTimeout(() => {
      setIsLoading(false);
      clearCart();
      toast.success('Payment successful! Order placed.');
      navigate('/orders');
    }, 2000);
  };

  return (
    <div className="bg-cream-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header & Steps */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl text-midnight mb-8">Checkout</h1>
          <div className="flex items-center justify-center max-w-md mx-auto">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-gold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 1 ? 'border-gold bg-gold/10' : 'border-gray-300'}`}>
                {step > 1 ? <Check size={16} /> : 1}
              </div>
              <span className="text-xs uppercase tracking-wider font-medium">Delivery</span>
            </div>
            <div className={`flex-1 h-px mx-4 ${step >= 2 ? 'bg-gold' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-gold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 2 ? 'border-gold bg-gold/10' : 'border-gray-300'}`}>
                2
              </div>
              <span className="text-xs uppercase tracking-wider font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Area */}
          <div className="lg:w-2/3">
            {step === 1 && (
              <div className="bg-white border border-gray-100 p-6 md:p-8">
                <h2 className="font-playfair text-2xl text-midnight mb-6 pb-4 border-b border-gray-100">Delivery Address</h2>
                
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">First Name</label>
                      <input type="text" required value={address.firstName} onChange={e => setAddress({...address, firstName: e.target.value})} className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
                      <input type="text" required value={address.lastName} onChange={e => setAddress({...address, lastName: e.target.value})} className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Phone Number</label>
                    <input type="tel" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold" />
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Street Address</label>
                    <input type="text" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">City</label>
                      <input type="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">State</label>
                      <input type="text" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">PIN Code</label>
                      <input type="text" required value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:border-gold" />
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <button type="submit" className="w-full bg-midnight text-gold py-4 uppercase tracking-widest text-sm font-medium hover:bg-black transition-colors">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white border border-gray-100 p-6 md:p-8">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <h2 className="font-playfair text-2xl text-midnight">Payment Method</h2>
                  <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gold underline">Edit Address</button>
                </div>
                
                <div className="mb-8 p-4 bg-gray-50 rounded text-sm text-gray-600">
                  <p className="font-medium text-midnight mb-1">Delivering to:</p>
                  <p>{address.firstName} {address.lastName}</p>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                  <p>{address.phone}</p>
                </div>

                <div className="border border-gold bg-gold/5 p-6 mb-8 relative overflow-hidden">
                  <ShieldCheck size={120} className="absolute -right-10 -bottom-10 text-gold/10" />
                  <div className="flex items-center mb-4 text-midnight">
                    <ShieldCheck size={24} className="mr-3 text-gold" />
                    <h3 className="font-medium text-lg">Secure Payment</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6 relative z-10">
                    All transactions are secure and encrypted. We use Razorpay to process payments, ensuring bank-level security for your transaction.
                  </p>
                  
                  <button 
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-4 px-4 rounded shadow hover:bg-blue-700 transition-colors font-medium flex justify-center items-center relative z-10"
                  >
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : `Pay ₹${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} with Razorpay`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-100 p-6 sticky top-32">
              <h2 className="font-playfair text-xl text-midnight mb-6 pb-4 border-b border-gray-100">In Your Cart</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm text-midnight line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-gold mt-1">₹{(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-playfair text-xl text-midnight">Total</span>
                    <span className="font-medium text-xl text-gold">
                      ₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
