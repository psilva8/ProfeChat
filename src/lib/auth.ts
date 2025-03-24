import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Create a new auth configuration for the lib file
const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          return { 
            id: "1", 
            name: "Test User", 
            email: credentials.email as string 
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Export authentication utilities
export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

// Helper function to get the current user
export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
} 