import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";

declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          // For testing purposes, accept any valid email/password
          return {
            id: "1",
            email: credentials.email as string,
            name: "Test User"
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export const auth = async () => await getServerSession(authOptions);

export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user;
};
