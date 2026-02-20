'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { services } from '@/lib/data';
import { HoverCard3D, FloatingElement3D, ParallaxSection, InteractiveButton3D } from '@/components/ui/3d-effects';
import Image from 'next/image';

// Temporarily disabled 3D background due to React 19 compatibility
// const SectionBackground = dynamic(() => import('@/components/3d/section-background').then(mod => ({ default: mod.SectionBackground })), {
//   ssr: false,
//   loading: () => <div className="w-full h-96 bg-gradient-to-br from-background to-secondary/20" />,
// });

function StaticBackground() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-green-50/30 via-amber-50/20 to-green-100/30">
      <div className="absolute top-5 left-5 w-24 h-24 bg-green-200/20 rounded-full blur-xl" />
      <div className="absolute top-15 right-15 w-20 h-20 bg-amber-200/20 rounded-full blur-xl" />
      <div className="absolute bottom-5 left-1/4 w-32 h-32 bg-green-300/20 rounded-full blur-xl" />
      <div className="absolute bottom-15 right-1/3 w-28 h-28 bg-amber-300/20 rounded-full blur-xl" />
    </div>
  );
}

export function ServicesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <ParallaxSection className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-green-50 overflow-hidden" id="services">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-300/30 to-transparent rounded-full blur-2xl" />
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-green-300/30 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <FloatingElement3D floatDistance={15} floatSpeed={4}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-4 text-balance">
              Why Choose Us
            </h2>
          </FloatingElement3D>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            We provide exceptional quality, service, and value to our customers
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <HoverCard3D 
                hoverColor="from-amber-400 to-green-400" 
                glowColor="rgba(251, 191, 36, 0.3)"
                className="h-full"
              >
                <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl h-full flex flex-col">
                  
                    <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg mb-4">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                 
                  <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 text-sm text-center flex-grow">
                    {service.description}
                  </p>
                 
                </div>
              </HoverCard3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ParallaxSection>
  );
}
