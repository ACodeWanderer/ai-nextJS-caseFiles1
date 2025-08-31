"use client"
import Link from "next/link"
import type React from "react"
import { useState } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      alert("Please fill in both fields.")
      return
    }

    setIsLoading(true)

    try {
      // Firebase authentication logic would go here
      // For now, we'll simulate a login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Login successful!")
      // Redirect to menu page
      window.location.href = "/menu"
    } catch (error) {
      alert("Login failed: " + (error as Error).message)
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="login-body">
        <div className="login-container">
          <div className="login-title">LOGIN</div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />

            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "LOGGING IN..." : "ENTER CASEFILE"}
            </button>
          </form>

          <div className="signup">
            NEW TO CASEFILE? <Link href="/signup">SIGN UP!</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-body {
          background-color: #080820;
          color: white;
          font-family: 'Orbitron', sans-serif;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url('/images/login_bg.png');
          background-size: cover;
          background-position: center;
          position: relative;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          background-color: rgba(0, 0, 0, 0.65);
          padding: 50px 40px;
          border-radius: 15px;
          width: 600px;
          height: 500px;
          max-width: 90%;
          text-align: center;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
        }

        .login-title {
          background-color: #b30000;
          display: inline-block;
          padding: 12px 30px;
          font-size: 1.7rem;
          color: white;
          border-radius: 5px;
          margin-bottom: 40px;
          font-weight: bold;
          text-shadow: 2px 2px 0 #400000;
          letter-spacing: 2px;
        }

        label {
          font-size: 1rem;
          margin-bottom: 8px;
          display: block;
          text-align: left;
          letter-spacing: 1px;
          color: #fff;
        }

        input[type="text"],
        input[type="password"] {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background-color: #1c1c3c;
          color: white;
          font-size: 1rem;
          margin-bottom: 30px;
          outline: none;
          box-shadow: 0 0 8px rgba(122, 92, 255, 0.3);
        }

        input::placeholder {
          color: #aaa;
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(to right, #7a5cff, #a875ff);
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          color: white;
          font-weight: bold;
          cursor: pointer;
          letter-spacing: 1px;
          transition: background 0.3s ease;
          box-shadow: 0 0 12px rgba(122, 92, 255, 0.6);
        }

        .login-btn:hover {
          background: linear-gradient(to right, #a875ff, #7a5cff);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .signup {
          margin-top: 30px;
          font-size: 0.9rem;
          color: #ccc;
        }

        .signup :global(a) {
          color: white;
          text-decoration: underline;
          font-weight: bold;
        }
      `}</style>
    </>
  )
}
