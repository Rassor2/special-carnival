import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Moon, Leaf } from 'lucide-react';

export const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sleep & Rest', path: '/category/sleep-rest' },
    { name: 'Mental Health', path: '/category/mental-health' },
    { name: 'Productivity', path: '/category/productivity-focus' },
    { name: 'Weekly Updates', path: '/weekly-updates' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50" data-testid="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2" data-testid="logo">
              <Leaf className="w-8 h-8 text-[#7C9A92]" />
              <span className="font-['Playfair_Display'] text-xl md:text-2xl font-semibold text-[#2D3748]">
                RestfulMind
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link text-sm font-medium ${
                    isActive(link.path)
                      ? 'text-[#7C9A92]'
                      : 'text-[#4A5568] hover:text-[#7C9A92]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-stone-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#2D3748]" />
              ) : (
                <Menu className="w-6 h-6 text-[#2D3748]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100" data-testid="mobile-menu">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg ${
                    isActive(link.path)
                      ? 'bg-[#E8E1D5] text-[#7C9A92]'
                      : 'text-[#4A5568] hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1C1C1E] text-white" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Leaf className="w-7 h-7 text-[#7C9A92]" />
                <span className="font-['Playfair_Display'] text-xl font-semibold">
                  RestfulMind
                </span>
              </Link>
              <p className="text-stone-400 text-sm leading-relaxed">
                Science-backed information on sleep, mental health, and productivity for a better life.
              </p>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-4 text-stone-200">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/category/sleep-rest" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Sleep & Rest
                  </Link>
                </li>
                <li>
                  <Link to="/category/mental-health" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Mental Health
                  </Link>
                </li>
                <li>
                  <Link to="/category/stress-anxiety" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Stress & Anxiety
                  </Link>
                </li>
                <li>
                  <Link to="/category/productivity-focus" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Productivity & Focus
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-stone-200">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/weekly-updates" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Weekly Updates
                  </Link>
                </li>
                <li>
                  <Link to="/category/lifestyle-habits" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Lifestyle & Habits
                  </Link>
                </li>
                <li>
                  <Link to="/category/research-studies" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Research & Studies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-stone-200">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-stone-400 hover:text-[#7C9A92] text-sm footer-link">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} RestfulMind. All rights reserved.
            </p>
            <p className="text-stone-500 text-xs">
              Information provided is for educational purposes only. Not medical advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
