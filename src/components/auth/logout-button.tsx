'use client';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      // Simple redirect to home page instead of using signOut
      window.location.href = '/';
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: just redirect to home
      window.location.href = '/';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-sm text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      Cerrar sesión
    </button>
  );
} 