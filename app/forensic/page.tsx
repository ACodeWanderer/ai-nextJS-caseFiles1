"use client"

import Link from "next/link"

export default function ForensicPage() {
  return (
    <>
      <div className="role-page">
        <img src="/images/forensic.png" alt="Forensic Expert" className="role-image" />

        <div className="role-box">
          <h2>FORENSIC EXPERT</h2>
          <p>
            Analyze the evidence.
            <br />
            Crack the DNA codes.
          </p>
          <Link href="/forensic-analysis" className="start-role-btn">
            Begin Analysis
          </Link>
        </div>

        <Link href="/playmodes" className="back-button">
          ← Back
        </Link>
      </div>

      <style jsx>{`
        .role-page {
          margin: 0;
          font-family: 'Courier New', monospace;
          background-color: #0b0b2e;
          color: white;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          height: 100vh;
          padding: 50px;
          gap: 30px;
          flex-wrap: wrap;
        }
        .role-image {
          height: 570px;
          border-radius: 18px;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
          transition: transform 0.3s ease;
        }
        .role-image:hover {
          transform: scale(1.02);
        }
        .role-box {
          background-color: #7a5cff;
          padding: 40px 30px;
          border-radius: 24px;
          max-width: 450px;
          color: white;
          box-shadow: 0 0 25px rgba(122, 92, 255, 0.6);
          font-size: 1.2rem;
          line-height: 1.6;
        }
        .role-box h2 {
          font-size: 2.2rem;
          margin-bottom: 15px;
          letter-spacing: 2px;
        }
        .start-role-btn {
          display: inline-block;
          margin-top: 25px;
          padding: 14px 28px;
          background: #0b0b2e;
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: bold;
          transition: background-color 0.3s, transform 0.3s;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
        }
        .start-role-btn:hover {
          background: #2c2c6e;
          transform: scale(1.05);
        }
        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: transparent;
          border: 2px solid #7a5cff;
          color: #7a5cff;
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 0.95rem;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
          text-decoration: none;
        }
        .back-button:hover {
          background-color: #7a5cff;
          color: white;
        }
      `}</style>
    </>
  )
}
