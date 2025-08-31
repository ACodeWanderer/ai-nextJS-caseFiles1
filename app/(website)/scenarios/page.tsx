"use client"

import { useState } from "react"
import Link from "next/link"

export default function ScenariosPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const showPage = (pageNum: number) => {
    setCurrentPage(pageNum)
  }

  return (
    <>
      <div className="body-container">
        {/* SCENARIO 1 */}
        <div className={`scenario-section ${currentPage === 1 ? "active" : ""}`} id="page1">
          <h1>SCENARIOS</h1>
          <div className="subtitle">CHOOSE A CASE. UNCOVER THE TRUTH.</div>
          <div className="description">
            EXPLORE REAL INVESTIGATIONS, DIVE INTO FICTION, OR UNLOCK HIDDEN MYSTERIES.
            <br />
            YOUR ROLE DEFINES THE OUTCOME.
          </div>

          <div className="section-title">REAL CASES</div>
          <div className="cases">
            <div className="case-box">
              <div className="case-icon">♊</div>
              <div className="case-title">THE ZODIAC CIPHER HUNT</div>
              <div className="case-desc">
                Decode cryptic letters and track a killer before the next cipher reaches the press!
              </div>
            </div>
            <div className="case-box">
              <div className="case-icon">🔪</div>
              <div className="case-title">THE JONBENÉT RAMSEY MYSTERY</div>
              <div className="case-desc">Revisit the chilling child murder that baffled investigators for decades.</div>
            </div>
          </div>

          <Link href="/menu" className="back-btn nav-btn">
            ⬅ Back
          </Link>
          <button className="next-btn nav-btn" onClick={() => showPage(2)}>
            Next ➜
          </button>
        </div>

        {/* SCENARIO 2 */}
        <div className={`scenario-section ${currentPage === 2 ? "active" : ""}`} id="page2">
          <h1>SCENARIOS</h1>
          <div className="subtitle">CHOOSE A CASE. UNCOVER THE TRUTH.</div>
          <div className="description">
            EXPLORE REAL INVESTIGATIONS, DIVE INTO FICTION, OR UNLOCK HIDDEN MYSTERIES.
            <br />
            YOUR ROLE DEFINES THE OUTCOME.
          </div>

          <div className="section-title">FICTIONAL THRILLERS</div>
          <div className="cases">
            <div className="case-box">
              <div className="case-icon">🏙️</div>
              <div className="case-title">CRIMSON ALLEY</div>
              <div className="case-desc">Neon lights hide bloody secrets — can you stop the Crimson killer?</div>
            </div>
            <div className="case-box">
              <div className="case-icon">🏚️</div>
              <div className="case-title">HAUNTING IN HAVERFORD</div>
              <div className="case-desc">A staged haunting or a perfect murder? Enter the mansion of fear!</div>
            </div>
          </div>

          <button className="back-btn nav-btn" onClick={() => showPage(1)}>
            ⬅ Back
          </button>
          <button className="next-btn nav-btn" onClick={() => showPage(3)}>
            Next ➜
          </button>
        </div>

        {/* SCENARIO 3 */}
        <div className={`scenario-section ${currentPage === 3 ? "active" : ""}`} id="page3">
          <h1>SCENARIOS</h1>
          <div className="subtitle">CHOOSE A CASE. UNCOVER THE TRUTH.</div>
          <div className="description">
            EXPLORE REAL INVESTIGATIONS, DIVE INTO FICTION, OR UNLOCK HIDDEN MYSTERIES.
            <br />
            YOUR ROLE DEFINES THE OUTCOME.
          </div>

          <div className="section-title">HISTORICAL-INSPIRED CASES</div>
          <div className="cases">
            <div className="case-box">
              <div className="case-icon">🐆</div>
              <div className="case-title">JACK THE RIPPER COPYCAT</div>
              <div className="case-desc">
                A modern predator revives Victorian terror — trace the patterns before history repeats!
              </div>
            </div>
            <div className="case-box">
              <div className="case-icon">🎥</div>
              <div className="case-title">THE BLACK DAHLIA REIMAGINED</div>
              <div className="case-desc">
                Step into 1940s Hollywood to unearth secrets buried with a starlet's brutal end!
              </div>
            </div>
          </div>

          <button className="back-btn nav-btn" onClick={() => showPage(2)}>
            ⬅ Back
          </button>
        </div>
      </div>

      <style jsx>{`
        .body-container {
          font-family: 'Orbitron', sans-serif;
          background-color: black;
          color: white;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .scenario-section {
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

        .scenario-section.active {
          display: flex;
          z-index: 2;
        }

        #page1 {
          background-image: url('/images/scenarios1.png');
        }

        #page2 {
          background-image: url('/images/scenarios2.png');
        }

        #page3 {
          background-image: url('/images/scenarios3.png');
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 12px;
          text-shadow: 0 0 12px black;
        }

        .subtitle {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #e0e0e0;
        }

        .description {
          font-size: 1rem;
          margin-bottom: 35px;
          color: #bbb;
        }

        .section-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 40px;
          color: #ff4444;
          text-shadow: 0 0 12px rgba(255, 68, 68, 0.8);
        }

        .cases {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          width: 100%;
          max-width: 1200px;
          margin-bottom: 60px;
        }

        .case-box {
          background-color: rgba(15, 15, 35, 0.88);
          border: 3px solid #ff4444;
          border-radius: 15px;
          width: 400px;
          height: 260px;
          padding: 30px 25px;
          text-align: center;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
          transition: 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .case-box:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 0 30px rgba(255, 68, 68, 0.7);
        }

        .case-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          display: block;
          text-shadow: 0 0 8px rgba(255,255,255,0.4);
        }

        .case-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 15px;
          color: white;
          text-shadow: 0 0 6px rgba(255,255,255,0.3);
        }

        .case-desc {
          font-size: 1.1rem;
          line-height: 1.5;
          color: #ffeb3b;
        }

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
          background-color: #5c48d3;
          box-shadow: 0 0 15px rgba(92,72,211,0.4);
          text-decoration: none;
          display: inline-block;
        }

        .nav-btn:hover {
          background-color: #7a5cff;
          box-shadow: 0 0 20px rgba(122,92,255,0.7);
        }

        .next-btn { 
          right: 50px; 
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
          .cases { 
            flex-direction: column; 
            gap: 25px; 
            align-items: center; 
          }
          .case-box { 
            width: 90%; 
            height: auto; 
            padding: 25px 20px; 
          }
          h1 { 
            font-size: 2.2rem; 
          }
          .section-title { 
            font-size: 1.6rem; 
          }
        }
      `}</style>
    </>
  )
}
