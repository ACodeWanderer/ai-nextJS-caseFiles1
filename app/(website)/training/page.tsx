"use client"

import { useState } from "react"
import Link from "next/link"

export default function TrainingPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const showPage = (pageNum: number) => {
    setCurrentPage(pageNum)
  }

  return (
    <>
      {/* PAGE 1 */}
      <div
        className={`training-section ${currentPage === 1 ? "active" : ""}`}
        style={{ backgroundImage: "url('/images/training1.png')" }}
      >
        <h1>TRAINING & RESEARCH</h1>
        <div className="subtitle">TRAIN SMARTER. RESEARCH DEEPER. INVESTIGATE LIKE A PRO.</div>

        <div className="card-grid">
          <div className="blue-card">
            <div className="card-icon">📄</div>
            <div className="card-title">EVIDENCE COLLECTION TRAINING</div>
            <div className="card-desc">
              Simulate real-world crime scenes and practice collecting, tagging, and analyzing forensic evidence.
            </div>
          </div>
          <div className="blue-card">
            <div className="card-icon">👤</div>
            <div className="card-title">WITNESS INTERROGATION</div>
            <div className="card-desc">Interactive AI-generated witness interviews to test questioning techniques.</div>
          </div>
          <div className="blue-card">
            <div className="card-icon">🕵️‍♂️</div>
            <div className="card-title">PROFILING & DEDUCTION SKILLS</div>
            <div className="card-desc">Learn suspect profiling with AI behavioral predictions.</div>
          </div>
          <div className="blue-card">
            <div className="card-icon">📊</div>
            <div className="card-title">CASE STUDY MODE</div>
            <div className="card-desc">Step through real-world cases to analyze investigator decision-making.</div>
          </div>
        </div>

        <Link href="/menu" className="back-btn nav-btn">
          ⬅ Back
        </Link>
        <button className="next-btn nav-btn" onClick={() => showPage(2)}>
          Next ➜
        </button>
      </div>

      {/* PAGE 2 */}
      <div
        className={`training-section ${currentPage === 2 ? "active" : ""}`}
        style={{ backgroundImage: "url('/images/training2.png')" }}
      >
        <h1>RESEARCH APPLICATIONS</h1>
        <div className="card-row" style={{ flexDirection: "column", gap: "40px" }}>
          <div className="ribbon-card" onClick={() => alert("Behavioral Psychology Studies clicked!")}>
            <div className="ribbon-icon">🧩</div>
            <div className="ribbon-text">
              Behavioral Psychology Studies: Simulate high-stress situations safely to study decision-making under
              duress.
            </div>
          </div>

          <div className="ribbon-card reverse" onClick={() => alert("Therapy & PTSD-Safe Exposure clicked!")}>
            <div className="ribbon-text">
              Therapy & PTSD-Safe Exposure: Controlled environments to recreate stressful events for therapy
              simulations.
            </div>
            <div className="ribbon-icon">🧠</div>
          </div>

          <div className="ribbon-card" onClick={() => alert("Data Analytics clicked!")}>
            <div className="ribbon-icon">📈</div>
            <div className="ribbon-text">
              Data Analytics: Collect structured data on user behavior for academic and forensic research.
            </div>
          </div>
        </div>

        <button className="back-btn nav-btn" onClick={() => showPage(1)}>
          ⬅ Back
        </button>
        <button className="next-btn nav-btn" onClick={() => showPage(3)}>
          Next ➜
        </button>
      </div>

      {/* PAGE 3 */}
      <div
        className={`training-section ${currentPage === 3 ? "active" : ""}`}
        style={{ backgroundImage: "url('/images/training3.png')" }}
      >
        <h1>ACADEMIA & LAW ENFORCEMENT</h1>
        <div className="subtitle">BUILT FOR CRIMINOLOGY LABS & LAW ENFORCEMENT UNITS</div>

        <div className="card-row">
          <div className="big-card">
            <div className="card-icon">💻</div>
            CASE SIMULATIONS
          </div>
          <div className="big-card">
            <div className="card-icon">🏅</div>
            CERTIFICATIONS
          </div>
          <div className="big-card">
            <div className="card-icon">🤝</div>
            ACADEMIC PARTNERS
          </div>
        </div>

        <button className="back-btn nav-btn" onClick={() => showPage(2)}>
          ⬅ Back
        </button>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :global(body) {
          font-family: 'Orbitron', sans-serif;
          background-color: black;
          color: white;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .training-section {
          display: none;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          height: 100vh;
          justify-content: center;
          background-size: cover;
          background-position: center;
          padding: 50px 30px;
          position: absolute;
          top: 0;
          left: 0;
        }

        .training-section.active {
          display: flex;
          z-index: 2;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 20px;
          text-shadow: 0 0 12px black;
        }

        .subtitle {
          font-size: 1.3rem;
          margin-bottom: 45px;
          color: #e0e0e0;
          max-width: 900px;
        }

        /* ===== PAGE 1 - Blue Rectangular Cards ===== */
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 50px;
          max-width: 1100px;
          width: 90%;
        }

        .blue-card {
          background-color: rgba(15, 15, 35, 0.9);
          border: 3px solid #1e90ff;
          border-radius: 18px;
          width: 100%;
          min-height: 240px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 0 25px rgba(30,144,255,0.4);
          transition: 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .blue-card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 0 35px rgba(30,144,255,0.8);
        }

        .card-icon {
          font-size: 3.2rem;
          margin-bottom: 20px;
          display: block;
          text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 15px;
          color: #ffffff;
          letter-spacing: 1px;
          text-shadow: 0 0 6px rgba(30,144,255,0.6);
        }

        .card-desc {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #aee7ff;
          max-width: 90%;
          margin: 0 auto;
        }

        /* ===== PAGE 2 - Improved Readable Ribbon Cards ===== */
        .ribbon-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: rgba(0,0,0,0.6);
          width: 750px;
          min-height: 120px;
          border-radius: 10px;
          padding: 15px 25px;
          position: relative;
          box-shadow: 0 0 20px rgba(255,215,0,0.3);
          cursor: pointer;
          transition: 0.3s;
        }

        .ribbon-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 0 30px rgba(255,215,0,0.6);
        }

        .ribbon-icon {
          width: 70px;
          height: 70px;
          background-color: #0a0a2a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          border: 3px solid #ffcc00;
          border-radius: 10px;
          flex-shrink: 0;
          color: #ffcc00;
        }

        .ribbon-text {
          background: linear-gradient(90deg, #b51414, #db1111);
          color: yellow;
          font-size: 1.2rem;
          line-height: 1.6;
          font-weight: bold;
          padding: 15px 20px;
          border-radius: 0 10px 10px 0;
          flex-grow: 1;
          margin-left: 15px;
          position: relative;
        }

        .ribbon-text::after {
          content: "";
          position: absolute;
          top: 0;
          right: -20px;
          width: 0;
          height: 0;
          border-top: 40px solid transparent;
          border-bottom: 40px solid transparent;
          border-left: 20px solid #333;
        }

        .ribbon-card.reverse .ribbon-text {
          margin-left: 0;
          margin-right: 15px;
          border-radius: 10px 0 0 10px;
        }

        .ribbon-card.reverse .ribbon-text::after {
          left: -20px;
          right: auto;
          border-left: none;
          border-right: 20px solid #333;
        }

        /* ===== PAGE 3 - Big Yellow Square Cards ===== */
        .card-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 40px;
          width: 100%;
          max-width: 1200px;
        }

        .big-card {
          width: 270px;
          height: 270px;
          border: 4px solid yellow;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          text-align: center;
          background-color: rgba(0,0,0,0.5);
          border-radius: 12px;
          transition: 0.3s;
          box-shadow: 0 0 25px rgba(255,255,0,0.2);
        }

        .big-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 0 30px rgba(255,255,0,0.6);
        }

        .big-card .card-icon {
          font-size: 4rem;
          margin-bottom: 15px;
        }

        /* ===== Navigation Buttons ===== */
        .nav-btn {
          position: absolute;
          bottom: 35px;
          padding: 0.9rem 1.8rem;
          border: none;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: bold;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.3s;
          text-transform: uppercase;
          color: white;
          text-decoration: none;
          display: inline-block;
        }

        .next-btn { 
          right: 50px; 
          background-color: #5c48d3; 
          box-shadow: 0 0 15px rgba(92,72,211,0.4); 
        }

        .next-btn:hover { 
          background-color: #7a5cff; 
          box-shadow: 0 0 20px rgba(122,92,255,0.7); 
        }

        .back-btn { 
          left: 50px; 
          background-color: #ff4444; 
          box-shadow: 0 0 15px rgba(255,68,68,0.4); 
        }

        .back-btn:hover { 
          background-color: #ff6666; 
          box-shadow: 0 0 20px rgba(255,102,102,0.7); 
        }

        @media screen and (max-width: 900px) {
          h1 { font-size: 2rem; }
          .subtitle { font-size: 1rem; margin-bottom: 30px; }
          .card-grid { grid-template-columns: 1fr; }
          .blue-card { width: 100%; min-height: auto; }
          .ribbon-card { flex-direction: column; width: 90%; }
          .ribbon-text { margin: 15px 0 0 0 !important; border-radius: 10px !important; }
          .big-card { width: 80%; height: 200px; }
        }
      `}</style>
    </>
  )
}
