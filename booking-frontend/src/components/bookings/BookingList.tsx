"use client";

import { useEffect } from 'react';
import { Booking } from '../../types';
import BookingCard from './BookingCard';
import { motion } from 'framer-motion';

interface BookingListProps {
  bookings: Booking[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, onDelete, isLoading = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <motion.div 
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-md p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <p className="text-gray-500 mb-4">No bookings found.</p>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {bookings.map(booking => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onDelete={onDelete}
          className="booking-card"
        />
      ))}
    </motion.div>
  );
};

export default BookingList;