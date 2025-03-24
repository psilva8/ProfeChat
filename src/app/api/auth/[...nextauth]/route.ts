import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

// Add error handling to the handlers
const getHandler = async (req: NextRequest) => {
  try {
    return await handlers.GET(req);
  } catch (error) {
    console.error('NextAuth GET Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal NextAuth Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

const postHandler = async (req: NextRequest) => {
  try {
    return await handlers.POST(req);
  } catch (error) {
    console.error('NextAuth POST Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal NextAuth Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET = getHandler;
export const POST = postHandler; 