// src/components/bookings/BookingForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { CreateBookingDto } from '../../types';
import { checkGoogleCalendarConflicts } from '../../services/bookings';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { createEvent } from '../../services/calendar';
import { useAuth } from '../../context/AuthContext';

interface BookingFormProps {
  onSubmit: (data: CreateBookingDto) => Promise<void>;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateBookingDto>();
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        staggerChildren: 0.07
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
        stiffness: 500,
        damping: 30
      }
    }
  };
  
  const handleFormSubmit = async (data: CreateBookingDto) => {
    if (!startDate || !endDate) {
      toast.error('Please select start and end times');
      return;
    }
    
    setIsChecking(true);
    try {
      const { hasConflict } = await checkGoogleCalendarConflicts(
        startDate.toISOString(),
        endDate.toISOString()
      );
      
      if (hasConflict) {
        toast.error('This time conflicts with an event in your Google Calendar');
        return;
      }
      const formData = {
        ...data,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString()
      };
      
      await onSubmit(formData);
      if (user?.googleCalendarConnected) {
        try {
          await createEvent({
            summary: data.title,
            description: 'Booking created from your Booking App',
            start: startDate,
            end: endDate
          });
        } catch (error) {
          console.error('Failed to create Google Calendar event:', error);
        }
      }
      
      // Reset form
      setStartDate(null);
      setEndDate(null);
      reset();
      
    } catch (error) {
      toast.error('Error checking calendar conflicts');
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white p-6 rounded-lg shadow-md"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-4" variants={itemVariants}>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Booking Title
        </label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Meeting with Client"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </motion.div>
      
      <motion.div className="mb-4 date-inputs" variants={itemVariants}>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Start Time
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={new Date()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholderText="Select start date and time"
        />
        {!startDate && (
          <p className="text-red-500 text-xs mt-1">Start time is required</p>
        )}
      </motion.div>
      
      <motion.div className="mb-6 date-inputs" variants={itemVariants}>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          End Time
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          minDate={startDate || new Date()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholderText="Select end date and time"
        />
        {!endDate && (
          <p className="text-red-500 text-xs mt-1">End time is required</p>
        )}
      </motion.div>
      
      <motion.button
      type="submit"
      disabled={isChecking}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Create Booking
    </motion.button>
    </motion.form>
  );
};

export default BookingForm;