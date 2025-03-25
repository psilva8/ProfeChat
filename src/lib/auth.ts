import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

// Define our auth config with more explicit types
const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          // For demo purposes, return a mock user
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/error',
  },
  callbacks: {
    // Add user ID to session
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

// Export the NextAuth instance with handlers
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