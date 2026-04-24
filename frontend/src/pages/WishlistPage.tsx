import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-cream-white min-h-screen py-12 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl text-midnight font-medium">My Wishlist</h1>
            <p className="text-gray-500 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors underline flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-100 p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="text-gray-300 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-playfair text-midnight mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              You haven't saved any items yet. Explore our collections and click the heart icon to add pieces you love to your wishlist.
            </p>
            <Link 
              to="/products" 
              className="bg-midnight text-gold px-8 py-4 uppercase tracking-widest text-sm hover:bg-black transition-colors duration-300"
            >
              Discover LUXE
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product) => (
              <div key={product.id} className="group flex flex-col h-full bg-white border border-gray-100 p-3 hover:shadow-xl transition-shadow duration-300 relative">
                
                {/* Remove button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-5 right-5 z-10 w-8 h-8 bg-white/80 backdrop-blur hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden mb-4 block">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  {!product.inStock && (
                    <div className="absolute top-2 left-2 bg-midnight text-white text-xs px-2 py-1 uppercase tracking-wider">
                      Sold Out
                    </div>
                  )}
                </Link>
                
                <div className="flex-1 flex flex-col">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{product.category}</p>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-playfair text-lg text-midnight hover:text-gold transition-colors mb-2 line-clamp-1">{product.name}</h3>
                  </Link>
                  
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <p className="text-gold font-medium">₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                      }}
                      disabled={!product.inStock}
                      className={`p-2 rounded-full border transition-colors ${
                        product.inStock 
                          ? 'border-midnight text-midnight hover:bg-midnight hover:text-gold' 
                          : 'border-gray-200 text-gray-300 cursor-not-allowed'
                      }`}
                      title={product.inStock ? "Add to Cart" : "Out of Stock"}
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
