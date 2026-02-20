'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { products, categories } from '@/lib/data';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { HoverCard3D, FloatingElement3D, ParallaxSection, InteractiveButton3D } from '@/components/ui/3d-effects';

// Temporarily disabled 3D background due to React 19 compatibility
// const SectionBackground = dynamic(() => import('@/components/3d/section-background').then(mod => ({ default: mod.SectionBackground })), {
//   ssr: false,
//   loading: () => <div className="w-full h-full bg-gradient-to-br from-background to-secondary/20" />,
// });

function StaticBackground() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-50/30 via-green-50/20 to-amber-100/30">
      <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200/20 rounded-full blur-xl" />
      <div className="absolute top-20 right-20 w-24 h-24 bg-green-200/20 rounded-full blur-xl" />
      <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-amber-300/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-green-300/20 rounded-full blur-xl" />
    </div>
  );
}

export function ProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => {
        const productCategory = p.category.toLowerCase();
        const selectedCat = selectedCategory.toLowerCase();
        console.log(`Filtering: ${productCategory} === ${selectedCat}`);
        return productCategory === selectedCat;
      });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Clicked category: ${categoryId}`);
    setSelectedCategory(categoryId);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden" id="products">
      {/* Static Background */}
      <div className="absolute inset-0 h-96 opacity-60">
        <StaticBackground />
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
          <FloatingElement3D floatDistance={12} floatSpeed={4}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-800 mb-4 text-balance">
              Our Premium Collection
            </h2>
          </FloatingElement3D>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Browse our extensive range of high-quality fabrics and textiles
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <InteractiveButton3D
                onClick={() => handleCategoryClick(cat.id)}
                color={selectedCategory === cat.id ? "from-amber-500 to-green-500" : "from-gray-400 to-gray-600"}
                className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base"
              >
                {cat.name}
              </InteractiveButton3D>
            </motion.div>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <HoverCard3D hoverColor="from-amber-400 to-green-400" glowColor="rgba(251, 191, 36, 0.4)">
                {/* Product Image */}
                <div className="relative w-full h-64 bg-amber-50 overflow-hidden rounded-t-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-amber-900">{product.name}</h3>
                    <span className="text-xs bg-gradient-to-r from-amber-500 to-green-500 text-white px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-800">{product.price}</span>
                    
                  </div>
                </div>
              </HoverCard3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
