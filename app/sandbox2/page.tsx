"use client"

import Link from "next/link"

export default function Sandbox2() {
  const handleCardClick = (cardName: string) => {
    alert(`${cardName} Clicked`)
  }

  return (
    <>
      <div className="container">
        <h1>Live Preview</h1>

        <div className="cards-container">
          <div className="card" onClick={() => handleCardClick("Case Visualization")}>
            <img src="https://img.icons8.com/ios-filled/100/FFFFFF/combo-chart--v1.png" alt="Visualization Icon" />
            CASE VISUALIZATION
          </div>

          <div className="card" onClick={() => handleCardClick("Switch Perspective")}>
            <img src="https://img.icons8.com/ios-filled/100/FFFFFF/sorting-arrows-horizontal.png" alt="Switch Icon" />
            SWITCH PERSPECTIVE
          </div>

          <div className="card" onClick={() => handleCardClick("Test Dialogues")}>
            <img src="https://img.icons8.com/ios-filled/100/FFFFFF/speech-bubble.png" alt="Dialogues Icon" />
            TEST DIALOGUES
          </div>

          <div className="card" onClick={() => handleCardClick("Simulate with AI")}>
            <img src="https://img.icons8.com/ios-filled/100/FFFFFF/artificial-intelligence.png" alt="AI Icon" />
            SIMULATE WITH AI AGENTS
          </div>
        </div>

        <Link href="/sandbox1" className="back-btn">
          ← Back
        </Link>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .container {
          margin: 0;
          padding: 0;
          background-color: #0a0a1a;
          font-family: 'Segoe UI', sans-serif;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }

        h1 {
          font-size: 3em;
          font-weight: bold;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin: 40px 0 50px;
          text-shadow: 2px 2px 8px black;
        }

        .cards-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 50px;
          padding: 20px;
          max-width: 1200px;
        }

        .card {
          width: 220px;
          height: 220px;
          background-color: transparent;
          border: 4px solid yellow;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: bold;
          font-size: 1em;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(255, 255, 0, 0.6);
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: scale(1.05);
        }

        .card:nth-child(odd) {
          margin-top: -20px;
        }

        .card:nth-child(even) {
          margin-top: 40px;
        }

        .card img {
          width: 60px;
          margin-bottom: 15px;
        }

        .back-btn {
          position: fixed;
          bottom: 25px;
          left: 25px;
          background: none;
          color: white;
          font-size: 1.2em;
          font-weight: bold;
          border: none;
          cursor: pointer;
          text-shadow: 1px 1px 3px black;
          text-decoration: none;
        }
      `}</style>
    </>
  )
}
