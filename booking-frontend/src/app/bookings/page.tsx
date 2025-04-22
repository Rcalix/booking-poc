// src/app/bookings/page.tsx
"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AuthGuard from '../../components/auth/AuthGuard';
import useBookings from '../../hooks/useBookings';
import BookingList from '../../components/bookings/BookingList';
import Header from '../../components/layout/Header';
import '../globals.css';

export default function Bookings() {
  const { bookings, isLoading, fetchBookings, deleteBooking } = useBookings();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <motion.main 
          className="container mx-auto px-4 py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-6 flex justify-between items-center" variants={itemVariants}>
            <h1 className="text-2xl font-bold text-gray-800">
              My Bookings
            </h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/bookings/new" 
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md"
              >
                New Booking
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <BookingList 
              bookings={bookings} 
              onDelete={deleteBooking} 
              isLoading={isLoading}
            />
          </motion.div>
        </motion.main>
      </div>
    </AuthGuard>
  );
}