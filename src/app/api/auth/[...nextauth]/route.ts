import { auth } from "@/lib/auth";

// Export NextAuth v5 handler function
const handler = auth;

export { handler as GET, handler as POST }; 