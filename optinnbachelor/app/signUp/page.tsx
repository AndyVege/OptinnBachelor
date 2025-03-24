'use client'
import React from 'react'

import { FaLock, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const signupSchema= z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

function signUpPage() {

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema),});
    const [error, setError] = useState("");
    const router = useRouter();

    const onSubmit = async (data: any) => {
        setError("");

    const fullName = `${data.firstName} ${data.lastName}`;

    const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: fullName,
            email: data.email,
            password: data.password,
        }),
    });
  
    if (!res.ok) {
        const responseData = await res.json();
        setError(responseData.message);
        return;
    }

    await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
    });

    router.push("/login");
}
  return (
    <div className="flex items-center justify-center min-h-screen">
         <div className="bg-white p-8  rounded-2xl shadow-lg w-full max-w-md">
            <h3 className="text-3xl mb-4 font-semibold  text-[#1E3528]">Optinn</h3>  
            <h3 className="text-2xl  font-extrabold mb-10 text-[#1E3528]">Create an account</h3> 
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-1 mb-4 space-x-4">
                <div>
                    <label className="block text-gray-600">First name</label>
                    <div className="flex items-center  rounded-lg px-3 py-2 mt-1 bg-gray-50">
                        <input 
                            type="text"
                            placeholder="First name"
                            {...register("firstName")}
                            className="w-full outline-none bg-transparent ml-2"
                        />
                    </div>
                    {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-600">Last Name</label>
                    <div className="flex items-center  rounded-lg px-3 py-2 mt-1 bg-gray-50">
                        <input
                            type="text"
                            placeholder="Last name"
                            {...register("lastName")}
                            className="w-full outline-none bg-transparent ml-2"
                        />
                    </div>
                    {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                </div>
            </div>
            
             <div className="mb-4">
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
               {errors.email && <p className="text-red-500">{errors.email.message}</p>}
             </div>
             
             <div className="mb-10">
               <label className="block text-gray-600">Password</label>
               <div className="flex items-center border rounded-lg px-3 py-2 mt-1 bg-gray-50">
                 <FaLock className="text-gray-500" />
                 <input 
                   type="password" 
                   placeholder="Enter your Password" 
                   {...register("password")}
                   className="w-full outline-none bg-transparent ml-2"
                 />
               </div>
               {errors.password && <p className="text-red-500">{errors.password.message}</p>}
             </div>
             
             <button type="submit" className="w-full bg-[#1E3528] text-white py-2 rounded-lg hover:bg-[#366249] transition">Sign Up</button>
           </form>
           
           <div className="text-center my-4">Or</div>
           
           <p className="text-center text-gray-600 mt-4">
             Already have an account? <Link href="/login" className="text-[#1E3528] hover:underline">Log in</Link>
           </p>
         </div>
       </div>
  )
}

export default signUpPage
