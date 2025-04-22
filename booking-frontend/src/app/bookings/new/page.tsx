// src/app/bookings/new/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGuard from '../../../components/auth/AuthGuard';
import BookingForm from '../../../components/bookings/BookingForm';
import useBookings from '../../../hooks/useBookings';
import Header from '../../../components/layout/Header';
import { CreateBookingDto } from '../../../types';
import { toast } from 'react-hot-toast';
import '../../globals.css';

export default function NewBooking() {
  const router = useRouter();
  const { createBooking } = useBookings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (data: CreateBookingDto) => {
    setIsSubmitting(true);
    try {
      const newBooking = await createBooking(data);
      if (newBooking) {
        setShowSuccess(true);
        toast.success('Booking created successfully!');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: {
        duration: 0.3
      }
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
          <motion.div className="max-w-2xl mx-auto" variants={itemVariants}>
            <motion.h1 
              className="text-2xl font-bold text-gray-800 mb-6"
              variants={itemVariants}
            >
              Create New Booking
            </motion.h1>
            
            <motion.div variants={itemVariants}>
              <BookingForm onSubmit={handleSubmit} />
            </motion.div>
            
            <AnimatePresence>
              {showSuccess && (
                <motion.div 
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="bg-green-100 text-green-700 rounded-full p-8">
                    <svg 
                      className="w-24 h-24" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.main>
      </div>
    </AuthGuard>
  );
}