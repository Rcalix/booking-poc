"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import AuthGuard from '../../../components/auth/AuthGuard';
import Header from '../../../components/layout/Header';
import useBookings from '../../../hooks/useBookings';
import { getBooking } from '../../../services/bookings';
import { Booking } from '../../../types';
import { toast } from 'react-hot-toast';

type BookingDetailProps = {
  params: {
    id: string;
  };
};
export default function BookingDetail({ params }: BookingDetailProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteBooking } = useBookings();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getBooking(id);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        toast.error('Could not load booking details');
        router.push('/bookings');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id, router]);

  const handleDelete = async () => {
    try {
      await deleteBooking(id);
      toast.success('Booking cancelled successfully');
      router.push('/bookings');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to cancel booking');
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
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8 flex justify-center items-center">
            <motion.div 
              className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!booking) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-gray-500">Booking not found</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

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
          <motion.div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8" variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <motion.h1 className="text-2xl font-bold text-gray-800" variants={itemVariants}>
                {booking.title}
              </motion.h1>
              <motion.span 
                className="px-4 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                variants={itemVariants}
              >
                {format(new Date(booking.startTime), 'MMMM d, yyyy')}
              </motion.span>
            </div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Time</h2>
              <p className="text-gray-600">
                {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
              </p>
            </motion.div>
            
            <motion.div className="flex justify-end space-x-4" variants={itemVariants}>
              <motion.button
                onClick={() => router.push('/bookings')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to List
              </motion.button>
              <motion.button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-medium"
                whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel Booking
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
    </AuthGuard>
  );
}