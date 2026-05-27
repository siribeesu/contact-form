// src/components/Navbar.jsx
// Top navigation bar with logo, links, theme toggle, and mobile menu

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
    { name: isAuthenticated ? 'Dashboard' : 'Admin Login', path: isAuthenticated ? '/admin/dashboard' : '/admin/login' },
  ];

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 font-medium transition-all duration-200 rounded-lg
     ${isActive
       ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
       : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
     }`;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="She Can Foundation Logo" 
              className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">
              She Can <span className="gradient-text">Foundation</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>

          {/* Right: Theme toggle + Hamburger */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              {isDark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-primary-600" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
            >
              {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 animate-slide-up">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl font-medium transition-all
                   ${isActive
                     ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                   }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
