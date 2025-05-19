'use client'
import React, { useState } from 'react'
import { FaLock, FaEnvelope } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const signupSchema = z.object({
  firstName: z.string().min(1, "Fornavn er nøvendig"),
  lastName: z.string().min(1, "Etternavn er nøvendig"),
  email: z.string().email({ message: "Ugyldig email addresse" }),
  password: z.string().min(6, { message: "Passord må inneholde minst 6 tegn" }),
})

type LoginData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

function SignUpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const [error, setError] = useState("")
  const router = useRouter()

  const onSubmit = async (data: LoginData) => {
    setError("")
    const fullName = `${data.firstName} ${data.lastName}`

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email: data.email,
        password: data.password,
      }),
    })

    if (!res.ok) {
      const responseData = await res.json()
      setError(responseData.message)
      return
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    router.push("/login")
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <h3 className="absolute top-10 left-1/2 -translate-x-1/2 text-4xl sm:text-5xl font-bold text-[#1E3528]">Optinn</h3>

      <div className="bg-white mt-32 sm:mt-24 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h3 className="text-2xl sm:text-3xl text-center font-extrabold mb-8 text-[#1E3528]">Lag bruker</h3>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <label className="block text-gray-600 text-sm">Fornavn</label>
              <div className="flex items-center border rounded-[8px] px-3 py-2 mt-1 bg-gray-50">
                <input
                  type="text"
                  placeholder="Fornavn"
                  {...register("firstName")}
                  className="w-full outline-none bg-transparent text-sm"
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-gray-600 text-sm">Etternavn</label>
              <div className="flex items-center border rounded-[8px] px-3 py-2 mt-1 bg-gray-50">
                <input
                  type="text"
                  placeholder="Etternavn"
                  {...register("lastName")}
                  className="w-full outline-none bg-transparent text-sm"
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Email</label>
            <div className="flex items-center border rounded-[8px] px-3 py-2 mt-1 bg-gray-50">
              <FaEnvelope className="text-gray-500" />
              <input
                type="email"
                placeholder="Skriv inn Email"
                {...register("email")}
                className="w-full outline-none bg-transparent ml-2 text-sm"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Passord</label>
            <div className="flex items-center border rounded-[8px] px-3 py-2 mt-1 bg-gray-50">
              <FaLock className="text-gray-500" />
              <input
                type="passord"
                placeholder="Skriv inn ditt Passord"
                {...register("password")}
                className="w-full outline-none bg-transparent ml-2 text-sm"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3528] text-white py-2 rounded-[8px] hover:bg-[#366249] transition"
          >
            Registrer
          </button>
        </form>

        <div className="text-center my-4 text-sm text-gray-500">Eller</div>

        <p className="text-center text-gray-600 text-sm mt-4">
          Har du allerede en bruker?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">Logg inn</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage
