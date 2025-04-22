"use client";

import { useRef, useState } from 'react';
import { Variants } from 'framer-motion';

type AnimationType = 
  | 'fadeIn' 
  | 'pulse' 
  | 'cardEntry' 
  | 'loading' 
  | 'pageTransition';

interface UseAnimationOptions {
  type: AnimationType;
  autoPlay?: boolean;
  delay?: number;
  staggerDelay?: number;
  selector?: string;
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeIn: {
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
  },
  
  pulse: {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  },
  
  cardEntry: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    item: {
      hidden: { opacity: 0, y: 20, scale: 0.9 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }
    }
  },
  
  loading: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  },
  
  pageTransition: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    item: {
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
    }
  }
};

const useAnimation = (options: UseAnimationOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState("hidden");
  
  const getVariants = () => {
    return animationVariants[options.type];
  };
  
  const getItemVariants = () => {
    const variants = animationVariants[options.type];
    return variants.item || variants;
  };
  
  const play = () => {
    setVariant("visible");
  };
  
  const stop = () => {
    setVariant("hidden");
  };
  
  return {
    elementRef,
    variant,
    variants: getVariants(),
    itemVariants: getItemVariants(),
    play,
    stop
  };
};

export default useAnimation;