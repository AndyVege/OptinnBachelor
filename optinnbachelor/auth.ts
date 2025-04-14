import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import { dbUser } from "./db";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { user } from "./db/schemaUser";
import { eq } from "drizzle-orm";
import {  verifyPassword } from "./lib/hashing";

async function getUserFromDb(email: string): Promise<any> {
  const users = await dbUser.select().from(user).where(eq(user.email, email)).limit(1);
  return users[0] || null;
}

export const authOptions : NextAuthOptions = {
  adapter: DrizzleAdapter(dbUser),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials:any) => {
        try {

          const user = await getUserFromDb(credentials.email)
          console.log(user)
          
          if (!user) {
            throw new Error("Invalid credentials.")
          }

          const isValid = verifyPassword(credentials.password,user.salt,user.password)
          if(!isValid){
            throw new Error("wrong password")
          }
         
          return user;   
        } 
        
        catch (error) {
          if (error instanceof ZodError) {
            return null
          }  
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/login",
    error:"/login"
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn Callback:", { user, account, profile ,email,credentials});
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect Callback:", { url, baseUrl });
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log("Session Callback:", { session, user, token });
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log("JWT Callback:", { token, user, account, profile });
      return token;
    }
  }
};
