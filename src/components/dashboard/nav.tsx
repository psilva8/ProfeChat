'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/lesson-plans', label: 'Lesson Plans' },
  { href: '/dashboard/rubrics', label: 'Rubrics' },
  { href: '/dashboard/activities', label: 'Activities' },
  { href: '/dashboard/subscription', label: 'Subscription' }
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 px-4 py-3 bg-white shadow rounded-lg">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${
              isActive
                ? 'text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
} 