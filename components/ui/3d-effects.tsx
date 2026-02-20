'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface HoverCard3DProps {
  children: React.ReactNode;
  className?: string;
  hoverColor?: string;
  glowColor?: string;
}

export function HoverCard3D({ children, className = "", hoverColor = "from-amber-500 to-green-500", glowColor = "rgba(251, 191, 36, 0.3)" }: HoverCard3DProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
      whileHover={{
        rotateX: 5,
        rotateY: 5,
        scale: 1.05,
        transition: { duration: 0.3, type: "spring" }
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${glowColor}, transparent)`,
          filter: 'blur(20px)',
          opacity: 0,
          transform: 'translateZ(-20px)'
        }}
        whileHover={{
          opacity: 1,
          transition: { duration: 0.3 }
        }}
      />
      <Card className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white ${className}`}
        style={{
          transform: 'translateZ(0)',
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${hoverColor}, transparent)`,
            transform: 'translateZ(1px)'
          }}
          whileHover={{
            opacity: 0.1,
            transition: { duration: 0.3 }
          }}
        />
        {children}
      </Card>
    </motion.div>
  );
}

interface FloatingElement3DProps {
  children: React.ReactNode;
  className?: string;
  floatDistance?: number;
  floatSpeed?: number;
}

export function FloatingElement3D({ children, className = "", floatDistance = 10, floatSpeed = 3 }: FloatingElement3DProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -floatDistance, 0],
      }}
      transition={{
        duration: floatSpeed,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
}

interface InteractiveButton3DProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  color?: string;
  hoverScale?: number;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function InteractiveButton3D({ 
  children, 
  className = "", 
  onClick,
  color = "from-amber-500 to-green-500",
  hoverScale = 1.05,
  type = 'button',
  disabled = false
}: InteractiveButton3DProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${color} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        transformStyle: 'preserve-3d'
      }}
      initial={{ rotateX: 0, rotateY: 0, scale: 1 }}
      whileHover={disabled ? {} : {
        rotateX: -5,
        rotateY: 5,
        scale: hoverScale,
        transition: { duration: 0.3, type: "spring" }
      }}
      whileTap={disabled ? {} : {
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      suppressHydrationWarning
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3), transparent)',
          transform: 'translateZ(10px)'
        }}
        whileHover={{
          opacity: 0.3,
          transition: { duration: 0.3 }
        }}
      />
      <span className="relative z-10 text-white">{children}</span>
    </motion.button>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  id?: string;
}

export function ParallaxSection({ children, className = "", speed = 0.5, id }: ParallaxSectionProps) {
  return (
    <motion.div
      id={id}
      className={`relative ${className}`}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, amount: 0.8 }}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        style={{
          transform: `translateY(${speed * 100}px)`,
          transformStyle: 'preserve-3d'
        }}
        whileInView={{
          translateY: 0,
          transition: { duration: 0.8, ease: "easeOut" }
        }}
        viewport={{ once: false, amount: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
