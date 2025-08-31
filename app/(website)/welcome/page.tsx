"use client"

import Link from "next/link"
import Image from "next/image"

export default function WelcomePage() {
  return (
    <div className="min-h-screen font-orbitron relative flex flex-col items-center justify-center animate-fade-in 
      bg-[radial-gradient(circle_at_center,#0b0c26,#000000)] text-[#e0e0e0]">
      
      {/* LOGIN button (top-right) */}
      <Link
        href="/login"
        className="login-btn"
      >
        LOGIN
      </Link>

      {/* Centered Welcome Image */}
      <Image
        src="/images/Welcome.png" // place in /public/images
        alt="Welcome to CaseFiles"
        width={1200}
        height={700}
        className="max-w-[90%] h-auto shadow-[0_0_25px_#7a5cff] rounded-lg"
        priority
      />

      {/* CONTINUE button (bottom-center) */}
      <Link
        href="/menu"
        className="continue-btn"
      >
        CONTINUE
      </Link>

      {/* BACK button (bottom-left) */}
      <Link
        href="/"
        className="back-button"
      >
        ← Back
      </Link>
    </div>
  )
}
