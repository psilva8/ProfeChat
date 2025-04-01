'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="relative h-[600px] w-full">
      {/* Background Image */}
      <Image
        src="/images/hero-bg.jpg"
        alt="Professional pressure washing in Los Angeles"
        fill
        className="object-cover brightness-50"
        priority
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Professional Pressure Washing Services in Los Angeles
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Transform your property with our expert cleaning solutions
          </motion.p>
          <motion.a
            href="/contact"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-primary/90 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Get Your Free Quote
          </motion.a>
        </div>
      </div>
    </div>
  )
} 