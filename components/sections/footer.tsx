'use client';

import { motion } from 'framer-motion';
import { companyInfo } from '@/lib/data';
import { Mail, Phone, MapPin } from 'lucide-react';
import { HoverCard3D, ParallaxSection } from '@/components/ui/3d-effects';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <ParallaxSection className="relative bg-gradient-to-br from-white via-amber-50 to-green-50">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-28 h-28 bg-gradient-to-br from-green-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-gradient-to-br from-amber-300/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-gradient-to-br from-green-300/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Full-width Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Company Name */}
            <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-amber-800 mb-4 text-balance">
                {companyInfo.name}
              </h3>
            </div>
            
            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 text-center">
                    <Mail className="w-6 h-6 text-amber-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">{companyInfo.email}</p>
                  </div>
                </HoverCard3D>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 text-center">
                    <Phone className="w-6 h-6 text-amber-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">{companyInfo.phone}</p>
                  </div>
                </HoverCard3D>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.3)">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 text-center">
                    <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">{companyInfo.address}</p>
                  </div>
                </HoverCard3D>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200/50 my-8" />

            {/* Developer Info */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                &copy; {currentYear} {companyInfo.name}. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Developed by <span className="font-semibold text-amber-600">Kandarp Patil</span> | 
                <a href="https://kandarp-patil-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 ml-1">
                  Click here to visit my website
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
}
