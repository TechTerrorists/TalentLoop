'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth } from '../../lib/auth.js';

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = auth.isAuthenticated() && !auth.isTokenExpired();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUser(auth.getCurrentUser());
      }
    };

    checkAuth();
    // Check auth status on storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <nav className="bg-[#F8FAFC] shadow-sm border-b border-[#D9EAFD]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              TalentLoop
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className={`text-lg font-medium transition-colors ${
                    pathname === '/'
                      ? 'text-[#BCCCDC]'
                      : 'text-gray-700 hover:text-[#BCCCDC]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-lg font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-[#BCCCDC]'
                      : 'text-gray-700 hover:text-[#BCCCDC]'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`text-lg font-medium transition-colors ${
                    pathname === '/'
                      ? 'text-[#BCCCDC]'
                      : 'text-gray-700 hover:text-[#BCCCDC]'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/login"
                  className="bg-[#BCCCDC] hover:bg-[#9AA6B2] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
