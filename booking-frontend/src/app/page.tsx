"use client"; 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeAnimation from "../components/animations/HomeAnimation";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import { motion } from 'framer-motion';
import './globals.css';
export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);


  return (
    <>
      <Header />
      <motion.div 
  className="relative"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">


     
      <motion.div 
        className="mt-12 lg:mt-0 flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <HomeAnimation />
      </motion.div>
  </div>
</motion.div>


    </>
  );
}