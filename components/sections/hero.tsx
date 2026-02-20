'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { CropVideoBackground } from '@/components/ui/crop-video-background';

function HeroFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <CropVideoBackground />
      <div className="text-center z-10 relative">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          POWERING INDIA'S
        </motion.h1>
        <motion.h2 
          className="text-5xl md:text-7xl font-bold text-amber-400 mb-6 drop-shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          CROP TRADE
        </motion.h2>
        <motion.p 
          className="text-2xl md:text-3xl text-white mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
        >
          WITH TRUST & TRANSPARENCY
        </motion.p>
        <motion.p 
          className="text-gray-200 mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
        >
          Premium quality agricultural trading solutions
        </motion.p>
      </div>
    </div>
  );
}

// Temporarily disabled 3D scene due to React 19 compatibility
// const HeroScene = dynamic(
//   () => import('@/components/3d/hero-scene').then(mod => ({ default: mod.HeroScene })),
//   {
//     ssr: false,
//     loading: () => <HeroFallback />,
//   }
// );

export function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden" id="hero">
      {/* Static Hero Background */}
      <HeroFallback />

      {/* Overlay gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* CTA Section - Positioned at bottom */}
      <motion.div
        className="absolute bottom-28 sm:bottom-24 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.p 
          className="text-white text-base sm:text-lg md:text-xl mb-1 sm:mb-2 drop-shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          Owned by
        </motion.p>
        <motion.p 
          className="text-white text-sm sm:text-base md:text-lg mb-1 sm:mb-2 drop-shadow-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          Ganesh Badgujar and Mayur Badgujar
        </motion.p>
      </motion.div>
    

      

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 sm:bottom-12 left-1/2 z-20 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-gray-700" />
      </motion.div>
    </section>
  );
}
