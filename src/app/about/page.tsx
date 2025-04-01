'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'

export default function About() {
  return (
    <>
      <Hero
        title="About Our Los Angeles Pressure Washing Company"
        subtitle="Dedicated to delivering exceptional cleaning results for your property"
        backgroundImage="/images/about-bg.jpg"
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Los Angeles's Trusted Pressure Washing Service</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  With years of experience serving the Los Angeles community, we have established ourselves as a leading provider of professional pressure washing services. Our commitment to quality and customer satisfaction has made us the go-to choice for residential and commercial cleaning needs.
                </p>
                <p className="text-gray-600">
                  We understand that every property in Los Angeles has unique cleaning requirements. That's why we offer customized pressure washing solutions tailored to meet your specific needs. From gentle cleaning for delicate surfaces to heavy-duty washing for tough stains, we have the expertise and equipment to handle it all.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="relative h-[400px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/about-team.jpg"
                alt="Our pressure washing team"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At the core of our business are the values that drive us to deliver excellence in every project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Service</h3>
              <p className="text-gray-600">We never compromise on the quality of our pressure washing services, using only the best equipment and techniques.</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Satisfaction</h3>
              <p className="text-gray-600">Your satisfaction is our priority. We work closely with you to ensure we meet and exceed your expectations.</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Environmental Responsibility</h3>
              <p className="text-gray-600">We use eco-friendly cleaning solutions and water-saving techniques to protect our environment.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Experience the Difference?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Let us show you why we're the most trusted pressure washing company in Los Angeles.
            </p>
            <motion.a
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Today
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  )
} 