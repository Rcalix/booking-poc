"use client";

import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import useCalendar from '../../hooks/useCalendar';

const ConnectCalendarButton = () => {
  const { user } = useAuth();
  const { connectCalendar } = useCalendar();

  if (user?.googleCalendarConnected) {
    return (
      <div className="flex items-center text-green-600">
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
      </div>
    );
  }

  return (
    <motion.button
      onClick={connectCalendar}
      className="flex items-center justify-center px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
      Connect Google Calendar
    </motion.button>
  );
};

export default ConnectCalendarButton;