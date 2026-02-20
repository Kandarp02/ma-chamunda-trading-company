'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '#hero', label: 'Home' },
    { href: '#products', label: 'Products' },
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 font-bold text-lg sm:text-xl md:text-2xl text-amber-700 truncate"
          >
            <img src="/logo.png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
            <span className="hidden sm:inline">MA CHAMUNDA TRADING COMPANY</span>
            <span className="sm:hidden">CMT</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium text-gray-800 hover:text-amber-400 transition-colors ${
                  item.label === 'Contact' ? 'bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg px-4 py-2 rounded-md' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
            {/* Admin Login Button */}
            <a
              href="/admin"
              className="text-sm font-medium bg-gray-800 hover:bg-gray-900 text-white border-0 shadow-lg px-4 py-2 rounded-md transition-colors"
            >
              🔐 Admin
            </a>
            {/* <Button 
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg"
            >
              Get Quote
            </Button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors ${
                    item.label === 'Contact' ? 'bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg' : ''
                  }`}
                >
                  {item.label}
                </a>
              ))}
              {/* Admin Login Button for Mobile */}
              <a
                href="/admin"
                onClick={handleNavClick}
                className="block px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
              >
                🔐 Admin
              </a>
              {/* <Button 
                size="sm"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                Get Quote
              </Button> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
