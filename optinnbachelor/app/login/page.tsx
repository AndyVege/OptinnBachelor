"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
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
  };

  const onSubmit = async (data: LoginData) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center">
        <h3 className="text-4xl sm:text-5xl font-bold text-[#1E3528]">Optinn</h3>
      </div>

      <div className="bg-white mt-32 sm:mt-20 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h3 className="text-2xl sm:text-3xl text-center font-extrabold mb-8 text-[#1E3528]">Login</h3>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            {errors.email && <p className="text-red-500 mb-1 text-sm">{errors.email.message}</p>}
            <label className="block text-gray-600 text-sm">Email</label>
            <div className="flex items-center border rounded-[8px] px-3 py-2 mt-1 bg-gray-50">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                placeholder="Enter your Email"
                {...register("email")}
                className="w-full outline-none bg-transparent ml-2 text-sm"
              />
            </div>
          </div>

          <div>
            {errors.password && <p className="text-red-500 mb-1 text-sm">{errors.password.message}</p>}
            <label className="block text-gray-600 text-sm">Password</label>
            <div className="flex items-center border rounded-[8px] px-3 py-2 mt-1 bg-gray-50">
              <FaLock className="text-gray-500" />
              <input
                type="password"
                placeholder="Enter your Password"
                {...register("password")}
                className="w-full outline-none bg-transparent ml-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-center text-sm mb-4">
            <a href="#" className="text-[#1E3528] hover:underline">Forgot Password?</a>
          </div>

          <button type="submit" className="w-full bg-[#1E3528] text-white py-2 rounded-[8px] hover:bg-[#366249] transition">
            Login
          </button>
        </form>

        <div className="text-center my-4 text-sm text-gray-500">Or</div>

        <div className="flex flex-col gap-3">
          <button
            className="w-full flex items-center justify-center border py-2 rounded-[8px] hover:bg-gray-100 transition text-sm"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="mr-2 text-lg" />
            Login with Google
          </button>

          <button
            className="w-full flex items-center justify-center border py-2 rounded-[8px] hover:bg-gray-100 transition text-sm"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <IoLogoGithub className="mr-2 text-lg" />
            Login with Github
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <Link href="/signUp" className="text-blue-600 hover:underline">Create here</Link>
        </p>
      </div>
    </div>
  );
}
