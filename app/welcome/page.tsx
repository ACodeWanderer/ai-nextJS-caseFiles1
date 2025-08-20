"use client"

import Link from "next/link"
import Image from "next/image"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-radial from-[#0b0c26] to-black text-white font-orbitron relative fade-in text-center pb-20">
      {/* LOGIN button */}
      <Link
        href="/login"
        className="absolute top-5 right-5 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors duration-300 z-20"
      >
        LOGIN
      </Link>

      <h1 className="text-5xl md:text-6xl font-bold text-white mt-16 mb-4 tracking-wider shadow-purple">
        Welcome to{" "}
        <span className="text-[#7a5cff]">
          Case<span className="text-[#ff4444] font-bold shadow-red">F</span>iles
        </span>
        !
      </h1>

      <div className="text-2xl font-bold text-[#a4a4ff] mt-8 mb-2 tracking-wide shadow-purple">
        Choose. Investigate. Survive. Solve.
      </div>
      <p className="text-xl text-gray-300 mb-10">Experience AI-powered crime simulations like never before!</p>

      <div className="flex justify-center items-center mb-10">
        <Image
          src="/images/narratives.png"
          alt="Smart Crime Narratives"
          width={800}
          height={450}
          className="max-w-[90%] rounded-lg shadow-[0_0_25px_#7a5cff]"
        />
      </div>

      {/* Continue button */}
      <Link
        href="/menu"
        className="bg-[#5c48d3] text-white px-7 py-3 rounded-full text-lg font-bold tracking-wide uppercase cursor-pointer transition-all duration-300 hover:bg-[#7a5cff] shadow-[0_0_10px_#7a5cff] hover:shadow-[0_0_15px_#a494ff] inline-block mb-8"
      >
        Continue
      </Link>

      {/* Back button */}
      <Link
        href="/"
        className="fixed bottom-6 left-6 bg-transparent border-2 border-[#7a5cff] text-[#7a5cff] px-5 py-2 rounded-full text-sm font-bold hover:bg-[#7a5cff] hover:text-white transition-all duration-300 z-20"
      >
        ← Back
      </Link>
    </div>
  )
}
