// components/layout/Header.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-bold text-blue-600">Booking App</span>
            </Link>
            
            {isAuthenticated && (
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/bookings"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname.startsWith('/bookings') && pathname !== '/bookings/new'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  href="/bookings/new"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === '/bookings/new'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  New Booking
                </Link>
              </nav>
            )}
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center">
                  <motion.div 
                    className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </motion.div>
                  <span className="ml-2 text-sm text-gray-700">
                    Hello, {user?.name?.split(' ')[0]}
                  </span>
                </div>
                <motion.button
                  onClick={() => logout()}
                  className="inline-block rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => login()}
                className="inline-block rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        {isAuthenticated && (
          <div className="space-y-1 pb-3 pt-2">
            <Link
              href="/dashboard"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === '/dashboard'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/bookings"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname.startsWith('/bookings') && pathname !== '/bookings/new'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              My Bookings
            </Link>
            <Link
              href="/bookings/new"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                pathname === '/bookings/new'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              New Booking
            </Link>
          </div>
        )}
        
        <div className="border-t border-gray-200 pb-3 pt-4">
          {isAuthenticated ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={() => logout()}
                className="ml-auto flex-shrink-0 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="px-4">
              <button
                onClick={() => login()}
                className="block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;