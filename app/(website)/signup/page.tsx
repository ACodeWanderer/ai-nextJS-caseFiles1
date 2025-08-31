"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !email || !password) {
      alert("Please fill all fields.")
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implement Firebase authentication
      alert("Signup successful! You can now log in.")
      router.push("/login")
    } catch (error) {
      alert("Error: " + (error as Error).message)
      console.error("Signup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Orbitron', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(145deg, #0d0d1a, #1a1a2e, #0d0d1a);
          color: white;
        }

        .signup-container {
          background-color: rgba(15, 15, 35, 0.9);
          padding: 40px 30px;
          border-radius: 12px;
          width: 400px;
          text-align: center;
          box-shadow: 0 0 20px rgba(122, 92, 255, 0.4);
          border: 1px solid rgba(255, 0, 0, 0.2);
        }

        .signup-title {
          font-size: 2rem;
          color: #ff4b4b;
          margin-bottom: 30px;
          font-weight: bold;
          letter-spacing: 1.5px;
          text-shadow: 0 0 10px rgba(255, 75, 75, 0.7);
        }

        input[type="text"],
        input[type="email"],
        input[type="password"] {
          width: 100%;
          padding: 12px;
          margin-bottom: 20px;
          border: 1px solid rgba(122, 92, 255, 0.3);
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          font-family: inherit;
          background-color: #0d0d1a;
          color: white;
          box-sizing: border-box;
        }

        input::placeholder {
          color: #888;
        }

        input:focus {
          border-color: #7a5cff;
          box-shadow: 0 0 8px rgba(122, 92, 255, 0.6);
        }

        .signup-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(to right, #7a5cff, #a875ff);
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          color: white;
          font-weight: bold;
          cursor: pointer;
          letter-spacing: 1px;
          transition: 0.3s ease;
          font-family: inherit;
          box-shadow: 0 0 12px rgba(122, 92, 255, 0.6);
        }

        .signup-btn:hover {
          background: linear-gradient(to right, #a875ff, #7a5cff);
          box-shadow: 0 0 20px rgba(255, 75, 75, 0.5);
        }

        .signup-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-link {
          margin-top: 20px;
          font-size: 0.9rem;
          color: #aaa;
        }

        .login-link a {
          color: #ff4b4b;
          text-decoration: none;
          font-weight: bold;
        }

        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-title">Create Your Account</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Choose a Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link href="/login">Login</Link>
        </div>
      </div>
    </>
  )
}
