import { auth } from "@/lib/auth";

// Use NextAuth handler directly
const handler = auth;

// Export as route handlers
export { handler as GET, handler as POST }; 