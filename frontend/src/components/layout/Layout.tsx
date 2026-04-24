import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-cream-white">
      <Navbar />
      <main className={`flex-grow ${isHomePage ? '' : 'pt-[60px]'}`}>
        {/* Padding top accounts for fixed navbar height */}
        <Outlet />
      </main>
      <footer className="bg-midnight text-cream-white py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-playfair text-gold text-2xl mb-4 tracking-wider">LUXE</h3>
              <p className="text-sm text-gray-400">Discover timeless elegance with our curated collection of luxury items.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/products?category=jewelry" className="hover:text-gold transition-colors">Jewelry</Link></li>
                <li><Link to="/products?category=watches" className="hover:text-gold transition-colors">Watches</Link></li>
                <li><Link to="/products?category=fashion" className="hover:text-gold transition-colors">Fashion</Link></li>
                <li><Link to="/products?category=accessories" className="hover:text-gold transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
                <li><a href="mailto:concierge@luxe.com" className="hover:text-gold transition-colors">Contact</a></li>
                <li><Link to="/about" className="hover:text-gold transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-gold transition-colors">Terms of Service</Link></li>
                <li><Link to="/" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
                <li><Link to="/" className="hover:text-gold transition-colors">Shipping Returns</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LUXE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
