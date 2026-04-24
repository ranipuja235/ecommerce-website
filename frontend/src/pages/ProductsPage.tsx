import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShoppingBag, Heart } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import api from '../api/axios';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters state
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, priceRange, minRating, inStockOnly, searchQuery, sortBy]);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let backendSort = 'newest';
        if (sortBy === 'price-low') backendSort = 'price_asc';
        if (sortBy === 'price-high') backendSort = 'price_desc';
        if (sortBy === 'rating') backendSort = 'rating';

        const { data } = await api.get('/products', {
          params: {
            category: category !== 'all' ? category : undefined,
            maxPrice: priceRange < 10000 ? priceRange : undefined,
            rating: minRating > 0 ? minRating : undefined,
            search: searchQuery || undefined,
            sort: backendSort,
            page: currentPage,
            limit: 6 // 6 items per page
          }
        });
        
        let mapped = data.products.map((p: any) => ({
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
        }));
        
        if (inStockOnly) {
          mapped = mapped.filter((p: Product) => p.inStock);
        }
        
        setProducts(mapped);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add debounce for search query typing
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [category, priceRange, minRating, inStockOnly, searchQuery, sortBy, currentPage]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSearchParams(newCategory === 'all' ? {} : { category: newCategory });
  };

  return (
    <div className="bg-cream-white min-h-screen pt-4 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Sticky Top Bar: Header, Search & Sort */}
        <div className="sticky top-[60px] z-30 bg-cream-white py-4 border-b border-gray-200/60 shadow-sm -mx-4 px-4 md:-mx-6 md:px-6 transition-all">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="font-playfair text-2xl md:text-3xl text-midnight font-medium">Our Collection</h1>
            
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
              <div className="relative w-full md:w-80">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 focus:outline-none focus:border-gold bg-white text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              
              <div className="flex w-full md:w-auto gap-3">
                <button 
                  className="md:hidden flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2.5 px-4 bg-white text-sm"
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                  <SlidersHorizontal size={16} />
                  <span>Filters</span>
                </button>
                <div className="flex-1 md:w-auto relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full md:w-auto appearance-none border border-gray-300 py-2.5 pl-4 pr-10 bg-white focus:outline-none focus:border-gold cursor-pointer text-sm"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 pt-6">
          {/* Sidebar Filters */}
          <aside className={`w-full md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white border border-gray-200 p-6 sticky top-[160px] md:top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto">
              <h3 className="font-playfair text-xl text-midnight mb-6 border-b border-gray-100 pb-2">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Category</h4>
                <div className="space-y-3">
                  {['all', 'jewelry', 'watches', 'fashion'].map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={category === cat}
                        onChange={() => handleCategoryChange(cat)}
                        className="text-gold focus:ring-gold accent-gold h-4 w-4"
                      />
                      <span className="ml-3 text-sm text-gray-600 capitalize hover:text-gold transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Max Price: ₹{priceRange}</h4>
                <input 
                  type="range" 
                  min="100" 
                  max="10000" 
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>₹100</span>
                  <span>₹10,000+</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Min Rating</h4>
                <div className="space-y-3">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="text-gold focus:ring-gold accent-gold h-4 w-4"
                      />
                      <div className="ml-3 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < rating ? "fill-gold text-gold" : "text-gray-300"} />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">& Up</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === 0}
                      onChange={() => setMinRating(0)}
                      className="text-gold focus:ring-gold accent-gold h-4 w-4"
                    />
                    <span className="ml-3 text-sm text-gray-600">Any Rating</span>
                  </label>
                </div>
              </div>

              {/* In Stock Toggle */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="text-gold focus:ring-gold accent-gold h-4 w-4 rounded-sm border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-600">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] mb-4"></div>
                    <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-100">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-midnight mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                <button 
                  onClick={() => {
                    setCategory('all');
                    setPriceRange(10000);
                    setMinRating(0);
                    setInStockOnly(false);
                    setSearchQuery('');
                  }}
                  className="mt-6 text-gold underline hover:text-midnight transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => (
                    <div key={product.id} className="group flex flex-col h-full bg-white border border-gray-100 p-3 hover:shadow-xl transition-shadow duration-300">
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
                      
                      {/* Wishlist Button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className="absolute top-5 right-5 z-10 w-8 h-8 bg-white/80 backdrop-blur hover:bg-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart 
                          size={16} 
                          className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"} 
                        />
                      </button>
                      
                      <div className="flex-1 flex flex-col mt-2">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{product.category}</p>
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-playfair text-lg text-midnight hover:text-gold transition-colors mb-2 line-clamp-1">{product.name}</h3>
                        </Link>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.reviewCount})</span>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
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
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-16 space-x-2">
                    <button 
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo(0, 0);
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 text-gray-500 hover:text-midnight hover:border-midnight transition-colors disabled:opacity-50"
                    >
                      Prev
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo(0, 0);
                        }}
                        className={`px-4 py-2 border ${
                          currentPage === i + 1 
                            ? 'bg-midnight text-gold border-midnight' 
                            : 'border-gray-300 text-gray-500 hover:text-midnight hover:border-midnight'
                        } transition-colors`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button 
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        window.scrollTo(0, 0);
                      }}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 text-gray-500 hover:text-midnight hover:border-midnight transition-colors disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
