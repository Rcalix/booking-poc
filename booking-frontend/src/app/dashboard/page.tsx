"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import useBookings from '../../hooks/useBookings';
import BookingList from '../../components/bookings/BookingList';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../globals.css';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();  
  const { bookings, isLoading, fetchBookings, deleteBooking, connectGoogleCalendar } = useBookings();

  useEffect(() => {
    if(isAuthenticated) {
    fetchBookings();
    }
  }, [fetchBookings, isAuthenticated]);

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

  const counterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2
      }
    }
  };

  return (
    <>
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
              Welcome, {user?.name}
            </h1>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/bookings/new" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md">
                  New Booking
                </Link>
              </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              variants={counterVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
              <motion.p 
                className="text-3xl font-bold text-primary-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {bookings.length}
                </motion.span>
              </motion.p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              variants={counterVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Bookings</h3>
              <motion.p 
                className="text-3xl font-bold text-primary-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {bookings.filter(b => new Date(b.startTime) > new Date()).length}
              </motion.p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6"
              variants={counterVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <h3 className="text-lg font-semibold text-gray-700">Past Bookings</h3>
              <motion.p 
                className="text-3xl font-bold text-primary-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {bookings.filter(b => new Date(b.endTime) < new Date()).length}
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 mb-8"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Google Calendar Integration</h3>
            {user?.googleCalendarConnected ? (
              <motion.div 
                className="flex items-center text-green-600"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <svg 
                  className="w-5 h-5 mr-2" 
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
                <span>Connected to Google Calendar</span>
              </motion.div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Connect your Google Calendar to prevent booking conflicts with your existing events.
                </p>
                <motion.button
                  onClick={connectGoogleCalendar}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md inline-flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z"/>
                  </svg>
                  Connect Calendar
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Recent Bookings */}
          <motion.h2 
            className="text-xl font-semibold text-gray-800 mb-4"
            variants={itemVariants}
          >
            Recent Bookings
          </motion.h2>
          
          <motion.div variants={itemVariants}>
            <BookingList 
              bookings={bookings} 
              onDelete={deleteBooking} 
              isLoading={isLoading}
            />
          </motion.div>
        </motion.main>
      </div>
      <Footer />
      </>
  );
}