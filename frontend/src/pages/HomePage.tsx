import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { Product } from '../types';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?featured=true&limit=4');
        const mappedProducts = data.products.map((p: any) => ({
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
        setFeaturedProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-midnight/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-7xl text-cream-white mb-6 leading-tight">
            Discover Timeless <span className="text-gold italic">Elegance</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Curated luxury for the modern connoisseur. Explore our exclusive collection of premium watches, jewelry, and fashion.
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-gold text-midnight font-medium uppercase tracking-widest py-4 px-10 rounded hover:bg-white transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-cream-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl text-midnight mb-4">The Collections</h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category 1 */}
            <Link to="/products?category=jewelry" className="group relative h-96 overflow-hidden rounded-sm">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-playfair text-3xl text-gold mb-2">Jewelry</h3>
                <span className="text-cream-white uppercase tracking-wider text-sm flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  Explore <span className="ml-2">→</span>
                </span>
              </div>
            </Link>

            {/* Category 2 */}
            <Link to="/products?category=fashion" className="group relative h-96 overflow-hidden rounded-sm">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-playfair text-3xl text-gold mb-2">Fashion</h3>
                <span className="text-cream-white uppercase tracking-wider text-sm flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  Explore <span className="ml-2">→</span>
                </span>
              </div>
            </Link>

            {/* Category 3 */}
            <Link to="/products?category=watches" className="group relative h-96 overflow-hidden rounded-sm">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop")' }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="font-playfair text-3xl text-gold mb-2">Watches</h3>
                <span className="text-cream-white uppercase tracking-wider text-sm flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  Explore <span className="ml-2">→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
            <div>
              <h2 className="font-playfair text-4xl text-midnight mb-2">Featured Pieces</h2>
              <p className="text-gray-500">Handpicked selections for you</p>
            </div>
            <Link to="/products" className="text-midnight uppercase tracking-wider text-sm font-medium hover:text-gold transition-colors pb-1">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {isLoading ? (
               [1, 2, 3, 4].map((i) => (
                 <div key={i} className="animate-pulse">
                   <div className="bg-gray-200 aspect-[3/4] mb-4"></div>
                   <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                   <div className="h-4 bg-gray-200 w-1/4"></div>
                 </div>
               ))
             ) : featuredProducts.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id} className="group cursor-pointer block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                     <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button className="w-full bg-midnight/90 text-gold py-3 uppercase tracking-wider text-sm hover:bg-midnight backdrop-blur-sm">
                          View Details
                        </button>
                      </div>
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg text-midnight line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2 capitalize">{product.category}</p>
                    <p className="text-gold font-medium">₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </Link>
             ))}
          </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-midnight relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl text-gold mb-4">Client Expressions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                text: "The quality is unparalleled. Every piece I've purchased from LUXE has exceeded my expectations.",
                author: "Eleanor C.",
                role: "Verified Buyer"
              },
              {
                text: "Exceptional service and exquisite craftsmanship. They truly understand what luxury means.",
                author: "Marcus T.",
                role: "Collector"
              },
              {
                text: "A seamless shopping experience from start to finish. The packaging alone is a work of art.",
                author: "Sophia L.",
                role: "Verified Buyer"
              }
            ].map((t, i) => (
              <div key={i} className="text-center">
                <div className="text-gold text-5xl font-playfair mb-6 opacity-50">"</div>
                <p className="text-cream-white text-lg italic mb-8 leading-relaxed">
                  {t.text}
                </p>
                <div className="w-12 h-px bg-gold mx-auto mb-4"></div>
                <h4 className="text-gold uppercase tracking-widest text-sm font-medium">{t.author}</h4>
                <p className="text-gray-400 text-sm mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-cream-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-playfair text-4xl text-midnight mb-4">Join The Exclusive Club</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="px-6 py-4 bg-white border border-gray-300 focus:outline-none focus:border-gold w-full sm:w-96"
            />
            <button 
              type="submit" 
              className="bg-midnight text-gold px-8 py-4 uppercase tracking-widest text-sm font-medium hover:bg-black transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
