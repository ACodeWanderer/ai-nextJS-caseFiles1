"use client"

import Link from "next/link"

export default function MenuPage() {
  return (
    <>
      <div className="menu-container">
        <h1>CASEFILES MENU</h1>

        <div className="menu-grid">
          <Link href="/playmodes" className="menu-btn">
            🎮 Play Modes
          </Link>
          <Link href="/scenarios" className="menu-btn">
            🕵️‍♂️ Scenarios
          </Link>
          <Link href="/training" className="menu-btn">
            📚 Training & Research
          </Link>
          <Link href="/ai-engine" className="menu-btn">
            🤖 AI Engine
          </Link>
          <Link href="/sandbox1" className="menu-btn">
            🧪 Sandbox
          </Link>
          <Link href="/media1" className="menu-btn">
            🎥 Media
          </Link>
        </div>

        <Link href="/welcome" className="back-btn">
          ← Back to Home
        </Link>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .menu-container {
          background: linear-gradient(to right, #f8f8ff, #eaeaff);
          font-family: 'Orbitron', sans-serif;
          color: #1e1e2e;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
          min-height: 100vh;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 40px;
          color: #4b2dbd;
          text-shadow: 0 0 8px rgba(75, 45, 189, 0.1);
          letter-spacing: 3px;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          width: 100%;
          max-width: 1000px;
        }

        .menu-btn {
          background: linear-gradient(135deg, #a18aff, #dcd4ff);
          color: #1e1e2e;
          padding: 20px 30px;
          border: none;
          border-radius: 18px;
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(140, 115, 255, 0.3);
          text-decoration: none;
          display: block;
        }

        .menu-btn:hover {
          transform: translateY(-6px) scale(1.05);
          background: linear-gradient(135deg, #bba4ff, #f0e9ff);
          box-shadow: 0 0 25px rgba(100, 80, 255, 0.4);
        }

        .back-btn {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: transparent;
          color: #4b2dbd;
          border: 2px solid #4b2dbd;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s ease;
          text-decoration: none;
        }

        .back-btn:hover {
          background-color: #4b2dbd;
          color: white;
        }

        @media screen and (max-width: 600px) {
          h1 {
            font-size: 2rem;
            margin-bottom: 30px;
          }

          .menu-btn {
            font-size: 1.1rem;
            padding: 16px 20px;
          }
        }
      `}</style>
    </>
  )
}
