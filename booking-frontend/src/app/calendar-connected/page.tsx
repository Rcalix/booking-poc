"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

export default function CalendarConnected() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  
  useEffect(() => {
    refreshAuth();
    
    toast.success('Google Calendar connected successfully!');
    
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [refreshAuth, router]);
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <svg 
            className="w-12 h-12 text-green-600" 
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
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Google Calendar Connected!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 text-center max-w-md"
        >
          Your Google Calendar has been successfully connected. 
          Now your bookings will be synchronized and conflicts will be automatically checked.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-gray-500"
        >
          Redirecting to dashboard...
        </motion.p>
      </div>
    </Layout>
  );
}