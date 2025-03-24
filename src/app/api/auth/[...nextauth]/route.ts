import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

const auth = NextAuth(authConfig);

export const GET = auth;
export const POST = auth; 