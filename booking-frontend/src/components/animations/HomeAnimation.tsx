"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Header from '../layout/Header';

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
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
    <>
      <motion.div 
        className="relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <motion.span 
                  className="block text-primary-600 xl:inline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Booking App
                </motion.span>
                <motion.span 
                  className="block xl:inline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {" "}for seamless scheduling
                </motion.span>
              </h1>
              <motion.p 
                className="mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
                variants={itemVariants}
              >
                Book time slots effortlessly while ensuring no conflicts with your existing calendar events. Simplify your scheduling process today.
              </motion.p>
              <motion.div className="mt-10 sm:flex" variants={itemVariants}>
                <motion.div 
                  className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="#features"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-primary-600 hover:bg-gray-50 md:px-10 md:py-4 md:text-lg"
                  >
                    Learn More
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

          <motion.div 
            id="features" 
            className="mt-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div 
            className="grid gap-8 md:gap-12 md:grid-cols-3"
            variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Smart Scheduling</h3>
                <p className="text-gray-600">
                  Book time slots without worrying about schedule conflicts. The system automatically checks availability.
                </p>
              </motion.div>

              <motion.div 
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Google Calendar Integration</h3>
                <p className="text-gray-600">
                  Seamlessly connect with your Google Calendar to prevent double bookings and keep all your schedules in sync.
                </p>
              </motion.div>

              <motion.div 
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Simple Management</h3>
                <p className="text-gray-600">
                  Easily view, modify or cancel your bookings with our intuitive user interface. Stay in control of your schedule.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to simplify your scheduling?</h2>
            <motion.button
              onClick={() => login()}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 md:py-4 md:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
      </motion.div>
    </>
  );
}