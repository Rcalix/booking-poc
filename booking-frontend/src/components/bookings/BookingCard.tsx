// src/components/bookings/BookingCard.tsx
"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { Booking } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingCardProps {
  booking: Booking;
  onDelete: (id: string) => void;
  className?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onDelete, className }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleting(true);
    onDelete(booking.id)
  };

  return (
    <AnimatePresence onExitComplete={() => !isDeleting && onDelete(booking.id)}>
      {!isDeleting ? (
        <motion.div
          className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className || ''}`}
          data-booking-id={booking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          whileHover={{ 
            y: -5, 
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
          }}
          layout
        >
          <div className="mb-4 flex items-center justify-between">
            <motion.h3 
              className="text-lg font-semibold text-gray-900"
              layoutId={`title-${booking.id}`}
            >
              {booking.title}
            </motion.h3>
            <motion.span 
              className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800"
              layoutId={`date-${booking.id}`}
            >
              {format(new Date(booking.startTime), 'MMM dd, yyyy')}
            </motion.span>
          </div>
          
          <div className="mb-4 text-gray-600">
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <motion.button 
              onClick={handleDeleteClick}
              className="rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default BookingCard;