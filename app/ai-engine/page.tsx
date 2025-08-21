"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AIEnginePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const showPage = (pageNum: number) => {
    setCurrentPage(pageNum);
  };
  const router = useRouter();

  return (
    <>
      <div className="ai-container">
        {/* PAGE 1 */}
        <div
          className={`ai-section ${currentPage === 1 ? "active" : ""}`}
          id="page1"
        >
          <h1>THE MIND BEHIND THE CRIME</h1>
          <div className="subtitle">
            FROM SUSPECT BEHAVIOR TO BRANCHING STORYLINES, EXPLORE THE
            INTELLIGENCE DRIVING IMMERSIVE INVESTIGATIONS.
          </div>
          <div className="ai-boxes">
            <div className="ai-box">
              📝
              <br />
              AI DIALOGUE ENGINE
            </div>
            <div className="ai-box">
              👤
              <br />
              BEHAVIOR MODELLING
            </div>
            <div className="ai-box">
              📜
              <br />
              EVIDENCE LOGIC ENGINE
            </div>
            <div className="ai-box">
              📖
              <br />
              CASE KNOWLEDGE GRAPH
            </div>
            <div className="ai-box">
              😀
              <br />
              EMOTION-TO-ACTION MAPPING
            </div>
          </div>
          {/* <Link href="/menu" className="back-btn nav-btn">
            ⬅ Back to Menu
          </Link> */}
          <button
            className="back-btn nav-btn"
            onClick={() => {
              router.back();
            }}
          >
            ⬅ Back
          </button>
          <button className="next-btn nav-btn" onClick={() => showPage(2)}>
            Next ➜
          </button>
        </div>

        {/* PAGE 2 */}
        <div
          className={`ai-section ${currentPage === 2 ? "active" : ""}`}
          id="page2"
        >
          <h1>THE MIND BEHIND THE CRIME</h1>
          <div className="subtitle">
            FROM SUSPECT BEHAVIOR TO BRANCHING STORYLINES, EXPLORE THE
            INTELLIGENCE DRIVING IMMERSIVE INVESTIGATIONS.
          </div>
          <div className="yellow-cards">
            <button className="yellow-card">
              Real-time conversation generation based on role, stress level, and
              prior decisions.
            </button>
            <button className="yellow-card">
              Tracks and simulates psychological states for each character:
              fear, denial, deception, panic.
            </button>
            <button className="yellow-card">
              Determines what evidence is discoverable, usable, and how it
              influences suspect behavior.
            </button>
            <button className="yellow-card">
              Integrates facts from real/fake case files, documents, and media
              transcripts.
            </button>
            <button className="yellow-card">
              Connects NPC emotional states to choices like fleeing, lying, or
              cooperating.
            </button>
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
          className={`ai-section ${currentPage === 3 ? "active" : ""}`}
          id="page3"
        >
          <h1>ETHICAL FRAMEWORK</h1>
          <div className="subtitle">BUILT WITH ETHICS AND TRANSPARENCY</div>

          <div className="rules">
            <div className="rule">
              <span className="rule-icon">⚖️</span> No real victim data is
              exploited
            </div>
            <div className="rule">
              <span className="rule-icon">⚖️</span> Public domain or
              fictionalized reconstructions only
            </div>
            <div className="rule">
              <span className="rule-icon">⚖️</span> Consent and anonymization
              for research‑mode data
            </div>
            <div className="rule">
              <span className="rule-icon">⚖️</span> AI cannot replicate harmful
              content without safety checks
            </div>
          </div>

          <div className="cta">WANT TO BUILD SMARTER CASES?</div>
          <div className="cta-buttons">
            <button className="cta-btn live-btn">Try Live Demo</button>
            <button className="cta-btn doc-btn">
              Download AI Documentation
            </button>
          </div>

          <button className="back-btn nav-btn" onClick={() => showPage(2)}>
            ⬅ Back
          </button>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ai-container {
          font-family: "Orbitron", sans-serif;
          background-color: black;
          color: white;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
        }

        .ai-section {
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

        .ai-section.active {
          display: flex;
          z-index: 2;
        }

        #page1 {
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.8),
              rgba(0, 0, 0, 0.7)
            ),
            url("/images/ai_engine.png");
        }

        #page2 {
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.8),
              rgba(0, 0, 0, 0.7)
            ),
            url("/images/ai_engine.png");
        }

        #page3 {
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.8),
              rgba(0, 0, 0, 0.7)
            ),
            url("/images/ai_engine.png");
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 15px;
          text-shadow: 0 0 12px black;
          letter-spacing: 2px;
        }

        .subtitle {
          font-size: 1.2rem;
          margin-bottom: 40px;
          color: #e0e0e0;
        }

        /* PAGE 1 (Zig-Zag Blue Glow Boxes) */
        .ai-boxes {
          display: flex;
          gap: 50px;
          justify-content: center;
          flex-wrap: nowrap;
          margin-bottom: 60px;
        }

        .ai-box {
          width: 220px;
          height: 220px;
          border: 3px solid #ffcc00;
          border-radius: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 15px;
          font-size: 1rem;
          color: white;
          text-align: center;
          box-shadow: 0 0 20px rgba(255, 204, 0, 0.6);
          transition: 0.3s;
        }

        .ai-box:nth-child(odd) {
          margin-top: 40px;
        }

        .ai-box:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 0 30px rgba(255, 204, 0, 1);
        }

        /* PAGE 2 (Zig-Zag Yellow Cards) */
        .yellow-cards {
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;
          gap: 40px;
          margin-top: 30px;
        }

        .yellow-card {
          background-color: #ffeb3b;
          color: black;
          font-family: "Kalam", cursive;
          font-size: 1.1rem;
          border: 4px solid #c62828;
          border-radius: 8px;
          padding: 20px;
          width: 200px;
          height: 180px;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(255, 235, 59, 0.5);
          transition: 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .yellow-card:nth-child(odd) {
          margin-top: 40px;
        }

        .yellow-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 25px rgba(255, 235, 59, 0.8);
        }

        /* PAGE 3 (Ethical Framework Rules) */
        .rules {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 60px;
          font-family: "Kalam", cursive;
          font-size: 1.3rem;
          color: #ffeb3b;
        }

        .rule {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 15px;
        }

        .rule-icon {
          font-size: 1.8rem;
          color: #ff4444;
          text-shadow: 0 0 10px rgba(255, 68, 68, 0.6);
        }

        /* CTA Buttons */
        .cta {
          font-size: 1.3rem;
          margin-bottom: 25px;
          font-style: italic;
          color: white;
        }

        .cta-buttons {
          display: flex;
          gap: 40px;
        }

        .cta-btn {
          padding: 0.8rem 2rem;
          border: none;
          border-radius: 30px;
          font-size: 1.05rem;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
          color: white;
        }

        .live-btn {
          background: linear-gradient(to right, #7a00ff, #ff007a);
          box-shadow: 0 0 15px rgba(255, 0, 122, 0.4);
        }

        .live-btn:hover {
          box-shadow: 0 0 25px rgba(255, 0, 122, 0.7);
          transform: translateY(-3px);
        }

        .doc-btn {
          background-color: transparent;
          border: 2px solid #fff;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }

        .doc-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
          transform: translateY(-3px);
        }

        /* Navigation Buttons */
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
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .next-btn {
          right: 50px;
          background-color: #5c48d3;
          box-shadow: 0 0 15px rgba(92, 72, 211, 0.4);
        }

        .next-btn:hover {
          background-color: #7a5cff;
          box-shadow: 0 0 20px rgba(122, 92, 255, 0.7);
        }

        .back-btn {
          left: 50px;
          background-color: #ff4444;
          box-shadow: 0 0 15px rgba(255, 68, 68, 0.4);
        }

        .back-btn:hover {
          background-color: #ff6666;
          box-shadow: 0 0 20px rgba(255, 102, 102, 0.7);
        }

        @media screen and (max-width: 900px) {
          h1 {
            font-size: 2rem;
          }
          .subtitle {
            font-size: 1rem;
          }
          .ai-box {
            width: 150px;
            height: 150px;
            font-size: 0.8rem;
          }
          .yellow-card {
            width: 160px;
            height: 140px;
            font-size: 0.9rem;
          }
          .rules {
            font-size: 1rem;
          }
          .cta-buttons {
            flex-direction: column;
            gap: 20px;
          }
          .ai-boxes,
          .yellow-cards {
            flex-wrap: wrap;
            gap: 30px;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
