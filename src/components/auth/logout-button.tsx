'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      Cerrar sesión
    </button>
  );
} 