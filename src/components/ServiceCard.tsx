'use client'

import { motion } from 'framer-motion'
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react'

interface ServiceCardProps {
  title: string
  description: string
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & RefAttributes<SVGSVGElement>>
}

export default function ServiceCard({ title, description, icon: Icon }: ServiceCardProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-primary mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
} 