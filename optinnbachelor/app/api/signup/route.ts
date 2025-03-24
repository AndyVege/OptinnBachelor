import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword  } from "@/lib/hashing";
import { dbUser } from "@/db";
import { user } from "@/db/schemaUser";
import { eq } from "drizzle-orm";


// Validation schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string(),
});

export async function POST(req: Request) {
  try { 

    const validatedData = signupSchema.parse(await req.json());
    
    const existingUser = await dbUser.select().from(user).where(eq(user.email, validatedData.email));

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User already exists" },{status: 400});
    }

    const{hashed,salt} = hashPassword(validatedData.password);

    await dbUser.insert(user).values({
        email:validatedData.email,
        password: hashed,
        salt:salt,
        name:validatedData.name,
      })
    return NextResponse.json({ message: "User created", },{status: 201});
  } 
  catch (error) {
    return NextResponse.json({ message: "Invalid input", error }, { status: 400 });
  }
}
