import React, { useRef, useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "/Back.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  // Load cart item count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartItemCount(count);
    };

    updateCartCount();
    
    // Listen for storage changes
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "#services" },
    { name: "Projects", href: "#projects" },
    { name: "About Us", href: "#about" },
    { name: "Contact Us", href: "#contact" },
  ];

  // Handle navigation
  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      // For anchor links, first check if we're on the home page
      if (window.location.pathname !== '/') {
        // If not on home page, navigate to home first, then scroll
        e.preventDefault();
        window.location.href = '/' + href;
        return;
      }
      
      // Smooth scroll for anchor links when on home page
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const top = el.getBoundingClientRect().top + window.scrollY - (headerHeight + 8);
      window.scrollTo({ top, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-header"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-2 md:py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Company Name */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Kimoel Trading Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
            />

            {/* Two lines on mobile, one line from md+ */}
            <div className="leading-tight">
              {/* Mobile: two lines, compact size */}
              <span className="block md:hidden font-extrabold text-brand-blue-dark text-sm sm:text-base">
                KIMOEL TRADING
              </span>
              <span className="block md:hidden font-extrabold text-brand-blue-dark text-sm sm:text-base">
                &amp; CONSTRUCTION INC.
              </span>

              {/* Desktop: single line, larger */}
              <span className="hidden md:block font-extrabold text-brand-blue-dark text-lg lg:text-2xl">
                KIMOEL TRADING AND CONSTRUCTION INC.
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-8"
            role="navigation"
            aria-label="Primary"
          >
            {navLinks.map((link) => {
              if (link.href.startsWith("#")) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => onNavClick(e, link.href)}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {link.name}
                  </a>
                );
              } else {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                );
              }
            })}
            
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Toggle (44px min tap target) */}
          <div className="md:hidden flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button
              className="grid place-items-center w-11 h-11 rounded-md ring-offset-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 transition"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              key="mobile-menu"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden mt-2 pt-2 border-t border-gray-200 bg-background/95 rounded-md shadow-md"
            >
              <nav className="flex flex-col px-4 py-3 space-y-1.5" aria-label="Mobile">
                {navLinks.map((link) => {
                  if (link.href.startsWith("#")) {
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={(e) => onNavClick(e, link.href)}
                        className="py-2 text-base text-foreground hover:text-primary font-medium transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="py-2 text-base text-foreground hover:text-primary font-medium transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    );
                  }
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
