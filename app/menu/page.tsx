"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();
  return (
    <>
      <div className="menu-container ">
        <h1>CASEFILES MENU</h1>

        <div className="menu-grid">
          <Link href="/playmodes" className="menu-btn">
            <div className="menu-card">🎮 Play Modes</div>
          </Link>

          <Link href="/scenarios" className="menu-btn">
            <div className="menu-card">🕵️‍♂️ Scenarios</div>
          </Link>

          <Link href="/training" className="menu-btn">
            <div className="menu-card">📚 Training & Research</div>
          </Link>

          <Link href="/ai-engine" className="menu-btn">
            <div className="menu-card">🤖 AI Engine</div>
          </Link>

          <Link href="/sandbox1" className="menu-btn">
            <div className="menu-card">🧪 Sandbox</div>
          </Link>

          <Link href="/media1" className="menu-btn">
            <div className="menu-card">🎥 Media</div>
          </Link>
        </div>

        {/* Fixed Back Button */}
        <button
          className="back-btn nav-btn"
          onClick={() => {
            router.back();
          }}
        >
          ⬅ Back
        </button>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .menu-container {
          background: linear-gradient(to right, #f8f8ff, #eaeaff);
          font-family: "Orbitron", sans-serif;
          color: #1e1e2e;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px;
          min-height: 100vh;
          position: relative;
        }

        h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 50px;
          color: #4b2dbd;
          text-shadow: 0 0 8px rgba(75, 45, 189, 0.1);
          letter-spacing: 3px;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          width: 100%;
          max-width: 1000px;
        }

        /* Card style */
        .menu-card {
          font-weight: bold;
          background: linear-gradient(135deg, #b9a9ff, #d4c6ff);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .menu-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 30px rgba(100, 80, 255, 0.25);
        }

        .menu-btn {
          display: block; /* makes the whole button clickable */
          background: linear-gradient(135deg, #a18aff, #dcd4ff);
          color: black;
          padding: 20px;
          border-radius: 14px;
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          box-shadow: 0 5px 15px rgba(140, 115, 255, 0.25);
          transition: all 0.3s ease;
        }

        .menu-btn:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #bba4ff, #f0e9ff);
          box-shadow: 0 0 25px rgba(100, 80, 255, 0.35);
        }

        .back-btn {
          position: fixed; /* fixed to viewport */
          bottom: 20px;
          left: 20px;
          padding: 10px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #b9a9ff, #d4c6ff);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .back-btn:hover {
          background-color: #4b2dbd;
          transform: scale(1.05);
        }

        @media screen and (max-width: 600px) {
          h1 {
            font-size: 2rem;
            margin-bottom: 30px;
          }

          .menu-btn {
            font-size: 1.1rem;
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
