import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // Import the authOptions from auth.ts

const handler = NextAuth(authOptions); // Use the configuration for NextAuth

export { handler as GET, handler as POST }; // Export both GET and POST handlers
