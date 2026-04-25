import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Package, User as UserIcon, Menu, X, LogOut, ChevronDown, MapPin, Globe, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-300 bg-midnight shadow-md py-3"
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-gold font-playfair text-3xl font-bold tracking-wider">
          LUXE
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className={`${location.pathname === '/' ? 'text-gold' : 'text-cream-white hover:text-gold'} transition-colors duration-200 uppercase tracking-wide text-sm font-medium`}>Home</Link>
          <Link to="/products" className={`${location.pathname.startsWith('/products') ? 'text-gold' : 'text-cream-white hover:text-gold'} transition-colors duration-200 uppercase tracking-wide text-sm font-medium`}>Shop</Link>
          <Link to="/about" className={`${location.pathname.startsWith('/about') ? 'text-gold' : 'text-cream-white hover:text-gold'} transition-colors duration-200 uppercase tracking-wide text-sm font-medium`}>About</Link>
        </nav>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-6 text-cream-white">
          <button className="hover:text-gold transition-colors duration-200">
            <Search size={20} />
          </button>
          <Link to="/wishlist" className={`${location.pathname.startsWith('/wishlist') ? 'text-gold' : 'hover:text-gold'} transition-colors duration-200 relative`}>
            <Heart size={20} />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-midnight text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistItemCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className={`${location.pathname.startsWith('/cart') ? 'text-gold' : 'hover:text-gold'} transition-colors duration-200 relative`}>
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-midnight text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-6 relative">
              <Link to="/orders" className={`${location.pathname.startsWith('/orders') ? 'text-gold' : 'hover:text-gold'} transition-colors duration-200`} title="My Orders">
                <Package size={20} />
              </Link>
              <div className="relative">
                <button 
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center space-x-2 hover:text-gold transition-colors duration-200 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user?.name}</span>
                  <ChevronDown size={16} className={`hidden lg:block transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-xl py-2 z-50 text-midnight rounded-sm">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 hover:text-gold transition-colors"
                    >
                      <Settings size={16} className="mr-3" />
                      Edit Profile
                    </Link>
                    <Link 
                      to="/addresses" 
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-50 hover:text-gold transition-colors"
                    >
                      <MapPin size={16} className="mr-3" />
                      Saved Addresses
                    </Link>
                    <button 
                      className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 hover:text-gold transition-colors cursor-not-allowed opacity-70"
                      title="Language selection coming soon"
                    >
                      <Globe size={16} className="mr-3" />
                      Language (EN)
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="hover:text-gold transition-colors duration-200">
              <UserIcon size={20} />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4 text-cream-white">
           <Link to="/cart" className="hover:text-gold transition-colors duration-200 relative">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-midnight text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-midnight z-50 flex flex-col pt-20 px-6">
          <button 
            className="absolute top-6 right-6 text-cream-white hover:text-gold"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={32} />
          </button>
          
          <nav className="flex flex-col space-y-8 mt-10 text-center">
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className={`${location.pathname === '/' ? 'text-gold' : 'text-cream-white hover:text-gold'} text-2xl font-playfair`}>Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/products" className={`${location.pathname.startsWith('/products') ? 'text-gold' : 'text-cream-white hover:text-gold'} text-2xl font-playfair`}>Shop</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} to="/about" className={`${location.pathname.startsWith('/about') ? 'text-gold' : 'text-cream-white hover:text-gold'} text-2xl font-playfair`}>About</Link>
            
            <div className="pt-8 border-t border-cream-white/20 flex justify-center space-x-8 text-cream-white">
              <button className="hover:text-gold"><Search size={24} /></button>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/wishlist" className={`${location.pathname.startsWith('/wishlist') ? 'text-gold' : 'hover:text-gold'} relative`}>
                <Heart size={24} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-midnight text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex space-x-8">
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/orders" className={`${location.pathname.startsWith('/orders') ? 'text-gold' : 'hover:text-gold'}`} title="My Orders">
                      <Package size={24} />
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/profile" className={`${location.pathname.startsWith('/profile') ? 'text-gold' : 'hover:text-gold'}`} title="Edit Profile">
                      <Settings size={24} />
                    </Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/addresses" className={`${location.pathname.startsWith('/addresses') ? 'text-gold' : 'hover:text-gold'}`} title="Saved Addresses">
                      <MapPin size={24} />
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="hover:text-gold" title="Logout">
                      <LogOut size={24} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold text-xs">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gold">{user?.name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="hover:text-gold"><UserIcon size={24} /></Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
