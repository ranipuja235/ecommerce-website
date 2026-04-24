import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, ShoppingBag, Truck, Shield, ArrowLeft } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        const mapped: Product = {
          id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          images: p.images,
          inStock: p.stock > 0,
          rating: p.rating,
          reviewCount: p.numReviews,
          featured: p.featured,
        };
        setProduct(mapped);
        setMainImage(mapped.images[0]);
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast.error('Product not found');
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };
    
    if (id) fetchProduct();
  }, [id]);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="bg-cream-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb & Back */}
        <div className="mb-8 flex items-center text-sm text-gray-500">
          <Link to="/products" className="flex items-center hover:text-gold transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Link>
          <span className="mx-4">|</span>
          <span className="uppercase tracking-wider">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden bg-white border border-gray-100">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 w-24 h-24 border-2 transition-colors ${mainImage === img ? 'border-gold' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h1 className="font-playfair text-4xl text-midnight mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.reviewCount} Reviews</span>
              </div>
              
              <p className="text-3xl text-gold font-medium">
                ₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <span className="block text-sm font-medium uppercase tracking-wider mb-4">Quantity</span>
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 bg-white">
                  <button 
                    onClick={() => handleQuantityChange('dec')}
                    className="p-3 text-gray-500 hover:text-midnight transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('inc')}
                    className="p-3 text-gray-500 hover:text-midnight transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <span className="ml-6 text-sm text-gray-500">
                  {product.inStock ? <span className="text-green-600 flex items-center">In Stock</span> : <span className="text-red-500">Out of Stock</span>}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center bg-midnight text-gold py-4 px-8 uppercase tracking-widest text-sm font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} className="mr-3" />
                Add to Cart
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className="flex items-center justify-center border border-midnight text-midnight py-4 px-8 uppercase tracking-widest text-sm font-medium hover:bg-midnight hover:text-cream-white transition-colors"
              >
                <Heart size={18} className={`mr-3 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                {isInWishlist(product.id) ? 'In Wishlist' : 'Wishlist'}
              </button>
            </div>

            {/* Guarantees */}
            <div className="space-y-4 py-6 border-t border-b border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Truck size={20} className="mr-4 text-gold" />
                Free express shipping on all orders
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield size={20} className="mr-4 text-gold" />
                Authenticity guaranteed. Lifetime warranty.
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="flex justify-center space-x-12 mb-8">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`uppercase tracking-wider text-sm font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === tab ? 'border-gold text-midnight' : 'border-transparent text-gray-400 hover:text-midnight'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            {activeTab === 'description' && (
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>{product.description}</p>
                <p>Designed with meticulous attention to detail, this piece represents the pinnacle of craftsmanship. Every element has been thoughtfully considered to ensure lasting beauty and elegance.</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 text-sm">
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-500 uppercase tracking-wider">Material</span>
                  <span className="font-medium">18k White Gold</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-500 uppercase tracking-wider">Origin</span>
                  <span className="font-medium">Switzerland</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-500 uppercase tracking-wider">Weight</span>
                  <span className="font-medium">15g</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-500 uppercase tracking-wider">SKU</span>
                  <span className="font-medium">{product.id}-LX</span>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-playfair text-2xl text-midnight mb-2">Customer Reviews</h3>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{product.rating} out of 5</span>
                      </div>
                    </div>
                    <button className="border border-midnight px-6 py-2 uppercase tracking-wider text-xs hover:bg-midnight hover:text-white transition-colors">
                      Write a Review
                    </button>
                 </div>
                 {/* Fake Review */}
                 <div className="border-b border-gray-100 pb-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                         <p className="font-medium text-midnight">Sarah J.</p>
                         <p className="text-xs text-gray-500">Verified Buyer - Oct 12, 2025</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm italic">"Absolutely breathtaking. The quality is even better in person. Will definitely be purchasing from LUXE again."</p>
                 </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
