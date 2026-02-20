'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Users, Award, Globe, Zap } from 'lucide-react';
import { HoverCard3D, FloatingElement3D, ParallaxSection, InteractiveButton3D } from '@/components/ui/3d-effects';

export function AboutSection() {
  const stats = [
    { label: 'Years in Business', value: '14+', icon: Award },
    { label: 'Happy Customers', value: '5000+', icon: Users },
    { label: 'Products', value: '200+', icon: Zap },
    { label: 'Regions Served', value: '15+', icon: Globe },
  ];

  return (
    <ParallaxSection className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-amber-50 to-green-50" id="about">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-amber-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-10 right-32 w-32 h-32 bg-gradient-to-br from-green-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/2 w-48 h-48 bg-gradient-to-br from-amber-300/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-36 h-36 bg-gradient-to-br from-green-300/30 to-transparent rounded-full blur-3xl" />
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
          <FloatingElement3D floatDistance={12} floatSpeed={3}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-4 text-balance">
              About Ma Chamunda Trading Company
            </h2>
          </FloatingElement3D>
         <p className="text-base sm:text-lg md:text-xl text-amber-700 max-w-2xl mx-auto">
            With over a decade of experience, we've established ourselves as a trusted supplier of premium agricultural products across the region.
          </p>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Video Container */}
              <div className="relative w-full h-96 md:h-[500px]">
                {/* Actual Video */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  src="/videos/about.mp4"
                />
                
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200/20 rounded-full blur-2xl" />
              </div>
            </div>
          </HoverCard3D>
        </motion.div>

        {/* 3D Company Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-16"
        >
          <div className="relative">
            {/* 3D Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-20 right-0 w-48 h-48 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute bottom-0 left-1/2 w-56 h-56 bg-gradient-to-br from-amber-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-500" />
              <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-gradient-to-br from-green-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Main Content */}
            <div className="relative bg-gradient-to-br from-amber-50 via-white to-green-50 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl border border-amber-200/50">
              <div className="text-center mb-12">
                <FloatingElement3D floatDistance={20} floatSpeed={4}>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-4 text-balance">
                    Our Journey in Agricultural Trading
                  </h3>
                </FloatingElement3D>
                
                    <p className="text-base sm:text-lg md:text-xl text-amber-700 max-w-2xl mx-auto">
                Rooted in Dharangaon, Maharashtra — a region known for its agricultural richness,
      <br /><br />
                We are committed to delivering high-quality Pulses, Cereals, Cotton, and Grains to homes and businesses worldwide. 
                <br /><br />
                Whether you’re a wholesaler, retailer, or international importer, we ensure each grain carries the promise of health and honesty.                  </p>
                
              </div>

              {/* 3D Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               
                  <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
                    <div className="p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl text-center h-full">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">2021</span>
                      </div>
                       <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Founded</h4>
                      <p className="text-sm sm:text-base text-gray-600">Started our journey with a vision to connect farmers directly with markets</p>
                    </div>
                  </HoverCard3D>


              
                  <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
                    <div className="p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl text-center h-full">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">1k+</span>
                      </div>
                       <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Happy Customers</h4>
                      <p className="text-sm sm:text-base text-gray-600">Built lasting relationships with farmers and traders across the region</p>
                    </div>
                  </HoverCard3D>
              

               
                  <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
                    <div className="p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl text-center h-full">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-amber-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">5+</span>
                      </div>
                       <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Regions</h4>
                      <p className="text-sm sm:text-base text-gray-600">Expanded our reach to serve multiple regions with quality agricultural products</p>
                    </div>
                  </HoverCard3D>
               
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
                  <div className="p-8 text-center">
                    <FloatingElement3D floatDistance={8} floatSpeed={2}>
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-green-100 rounded-2xl shadow-lg">
                          <IconComponent className="w-8 h-8 text-amber-600" />
                        </div>
                      </div>
                    </FloatingElement3D>
                    <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <p className="text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </HoverCard3D>
              </motion.div>
            );
          })}
        </motion.div> */}

        {/* Main Content
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.2)">
            <div className="p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Founded in 2010, Chamunda Mata Traders has grown from a small local business to a trusted name in agricultural trading. We pride ourselves on quality, transparency, and building lasting relationships with both farmers and customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <InteractiveButton3D 
                  color="from-amber-500 to-green-500"
                  className="px-8 py-3"
                >
                  Learn More
                </InteractiveButton3D>
                <InteractiveButton3D 
                  color="from-gray-400 to-gray-600"
                  className="px-8 py-3"
                >
                  Contact Us
                </InteractiveButton3D>
              </div>
            </div>
          </HoverCard3D>
        </motion.div> */}
      </div>
    </ParallaxSection>
  );
}
