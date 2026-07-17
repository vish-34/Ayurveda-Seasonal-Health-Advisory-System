import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, LogOut, LayoutDashboard, BookOpen, Shield, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-neutral-100 bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-emerald-950">Prakriti+</span>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest leading-none">Seasonal Health</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'text-emerald-700' : 'text-neutral-600 hover:text-emerald-600'
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/herbs"
              className={`text-sm font-medium transition-colors ${
                isActive('/herbs') ? 'text-emerald-700' : 'text-neutral-600 hover:text-emerald-600'
              }`}
            >
              Herbs Gallery
            </Link>
            <Link
              to="/articles"
              className={`text-sm font-medium transition-colors ${
                isActive('/articles') ? 'text-emerald-700' : 'text-neutral-600 hover:text-emerald-600'
              }`}
            >
              Articles
            </Link>

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive('/admin')
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* User Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 border-l border-neutral-100 pl-4">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-neutral-800 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-neutral-500 uppercase font-semibold">
                      {user.doshaProfile?.dominantDosha || 'No Dosha'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-red-200 text-xs font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-500 hover:text-emerald-600 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-4 space-y-3 animate-fade-in shadow-inner">
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50"
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/herbs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50"
          >
            Herbs Gallery
          </Link>
          <Link
            to="/articles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50"
          >
            Articles
          </Link>
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
            >
              Admin Panel
            </Link>
          )}
          <div className="border-t border-neutral-100 pt-3">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center px-3 space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{user.name}</p>
                    <p className="text-xs text-neutral-500 uppercase">
                      Dosha: {user.doshaProfile?.dominantDosha || 'Not Assessed'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-neutral-600 hover:text-emerald-600 border border-neutral-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
