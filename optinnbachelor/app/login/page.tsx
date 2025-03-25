"use client"

import { useState } from "react";
import { signIn} from "next-auth/react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {

  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const router = useRouter();

  type LoginData = {
    email: string;
    password: string;
  }
  
  const onSubmit = async (data : LoginData) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } 
    else {
      router.push("/");
    }
  };

  return( 
   <div className="flex items-center justify-center min-h-screen">
    <h3 className="absolute top-10 left-1/2 -translate-x-1/2 text-5xl font-bold text-[#1E3528]">Optinn</h3>
      <div className="bg-white p-8  rounded-2xl shadow-lg w-full max-w-md"> 
        <h3 className="text-2xl text-center font-extrabold mb-12 text-[#1E3528]">Login</h3> 
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <label className="block text-gray-600">Email</label>
            <div className="flex items-center  rounded-lg px-3 py-2 mt-1 bg-gray-50">
              <FaEnvelope className="text-gray-500" />
              <input 
                type="email" 
                placeholder="Enter your Email" 
                {...register("email")}
                className="w-full outline-none bg-transparent ml-2"
              />
            </div>
          </div>
          
          <div className="mb-4">
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <label className="block text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 bg-gray-50">
              <FaLock className="text-gray-500" />
              <input 
                type="password" 
                placeholder="Enter your Password" 
                {...register("password")} 
                className="w-full outline-none bg-transparent ml-2"              />
            </div>
          </div>
          
          <div className="flex justify-center items-center text-sm mb-6">
            <a href="#" className="text-[#1E3528] hover:underline">Forgot Password?</a>
          </div>
          
          <button type="submit" className="w-full bg-[#1E3528] text-white py-2 rounded-lg hover:bg-[#366249] transition">Login</button>
        </form>
        
        <div className="text-center my-4">Or</div>
        
        <div className="flex flex-col space-y-3">
          <button 
          className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition"
          onClick={()=> signIn("google")} >

          <FcGoogle className= "mr-2" />
          Login with Google
        </button>
        <button 
          className="w-full flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100 transition"
          onClick={()=>signIn("github", { callbackUrl: "/" })} >

          <IoLogoGithub  className= "mr-2" />
          Login with Github
        </button>
        </div>
        
        <p className="text-center text-gray-600 mt-4">
          Don’t have an account? <Link href="/signUp" className="text-blue-600 hover:underline">Create here</Link>
        </p>
      </div>
    </div>
  
  )
}
