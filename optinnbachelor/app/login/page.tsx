"use client";

import NavbarL from "../ui/loginNavbar";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserIcon, LockIcon } from "lucide-react"; 

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("Generelt");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Attempt sign-in with credentials
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false, // We'll handle the redirect manually
    });

    if (result && !result.error) {
      // Successful login; redirect wherever you like
      router.push("/");
    } else {
      // Show an error message if login fails
      alert("Invalid credentials!");
    }
  }

  return (
    <div>
      <NavbarL activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-10 grid grid-cols-1 place-items-center gap-6">
        <div className="bg-[#1E3528] rounded-[30px] shadow-md p-6 h-[40rem] w-[35rem] flex flex-col items-center justify-center">
          <div className="text-8xl font-bold font-san text-white mb-10">
            Optinn
          </div>

          {/* Wrap the inputs in a <form> so we can handle submission */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[30px] shadow-md p-10 w-[28rem] h-[26rem] flex flex-col items-center"
          >
            {/* Brukernavn Input */}
            <div className="flex items-center bg-gray-300 rounded-full p-4 w-full mb-8">
              <span className="text-gray-600 text-xl ml-2">
                <UserIcon />
              </span>
              <input
                type="text"
                placeholder="Skriv brukernavn"
                className="bg-transparent outline-none text-gray-600 w-full ml-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Passord Input */}
            <div className="flex items-center bg-gray-300 rounded-full p-4 w-full mb-4">
              <span className="text-gray-600 text-xl ml-2">
                <LockIcon />
              </span>
              <input
                type="password"
                placeholder="Skriv passord"
                className="bg-transparent outline-none text-gray-600 w-full ml-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Glemt passord */}
            <p className="text-gray-600 text-sm mb-16 cursor-pointer">
              Glemt passord?
            </p>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-[#1E3528] text-white font-bold py-3 px-6 rounded-full text-lg w-full"
            >
              Logg inn
            </button>

            {/* Registrer Link */}
            <p className="text-gray-600 text-sm mt-4">
              Har du ikke bruker?{" "}
              <span className="text-blue-500 cursor-pointer">
                Registrer deg.
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
