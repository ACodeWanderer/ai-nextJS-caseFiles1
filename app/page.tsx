"use client"
import Link from "next/link"
import { useEffect } from "react"

export default function HomePage() {
  // Optional fade-in effect
  useEffect(() => {
    document.body.style.margin = "0"
    document.body.style.padding = "0"
  }, [])

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/landing-page.png')" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-7 text-center h-screen animate-fadeIn">
        {/* Logo */}
        <div className="text-xl md:text-2xl tracking-[5px] text-[#8c52ff] drop-shadow-[2px_2px_8px_black]">
          ⚡ WEVOLVE ⚡
        </div>

        {/* Presents */}
        <div className="text-lg font-light text-gray-200 drop-shadow-[2px_2px_6px_black]">
          PRESENTS
        </div>

        {/* Title */}
        <div className="text-5xl md:text-7xl font-[VT323] tracking-[4px] text-[#ff4ecb] drop-shadow-[3px_3px_10px_black]">
          CaseFiles
        </div>

        {/* Subtitle */}
        <div className="text-xl md:text-2xl font-[VT323] tracking-[4px] text-[#b366ff] drop-shadow-[2px_2px_8px_black]">
          AI CRIME $CENE $IMULATOR
        </div>

        {/* Play Button */}
        <Link href="/welcome" className="mt-12">
          <button className="bg-[#8c52ff] text-white px8 py-4 rounded-full text-lg md:text-xl font-bold uppercase tracking-[2px] cursor-pointer transition-all duration-300 flex items-center gap-3 shadow-[0_0_15px_#8c52ff] hover:bg-[#a875ff] hover:scale-105 hover:shadow-[0_0_25px_#c79cff]">
            PLAY NOW <span className="text-2xl">➜</span>
          </button>
        </Link>
      </div>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out;
        }
      `}</style>
    </div>
  )
}
