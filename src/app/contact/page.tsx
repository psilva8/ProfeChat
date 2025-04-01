'use client'

import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import ContactForm from '@/components/ContactForm'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

export default function Contact() {
  return (
    <>
      <Hero
        title="Contact Us"
        subtitle="Get in touch for professional pressure washing services in Los Angeles"
        backgroundImage="/images/contact-bg.jpg"
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-gray-600 mb-8">
                Ready to transform your property? Contact us today for a free estimate on our pressure washing services in Los Angeles.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <PhoneIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">info@lapressurewash.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPinIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Service Area</h3>
                    <p className="text-gray-600">Greater Los Angeles Area</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <ClockIcon className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Service Areas in Los Angeles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              We provide professional pressure washing services throughout Los Angeles, including Downtown LA, Beverly Hills, Santa Monica, Hollywood, and surrounding areas.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium text-gray-900">Downtown LA</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium text-gray-900">Beverly Hills</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium text-gray-900">Santa Monica</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="font-medium text-gray-900">Hollywood</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
} 