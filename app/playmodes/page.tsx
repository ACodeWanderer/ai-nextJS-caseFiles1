"use client"

import Link from "next/link"

export default function PlaymodesPage() {
  return (
    <>
      <div className="page-container">
        <h1>Play Modes</h1>
        <p className="subtitle">Each role gives you a different perspective — dive into the case from all angles!</p>

        <div className="role-container">
          <div className="role">
            <Link href="/detective">
              <button className="role-button">Lead Detective</button>
            </Link>
            <div className="role-info">
              <p>
                <strong>Gameplay Focus:</strong> Investigation, interviews, timeline management
              </p>
              <p>
                <strong>Tools:</strong> Notepad, Suspect board, Clue tracker
              </p>
              <p>
                <strong>Challenges:</strong> Misdirection, conflicting testimonies, pressure to solve
              </p>
            </div>
          </div>

          <div className="role">
            <Link href="/forensic">
              <button className="role-button">Forensic Analyst</button>
            </Link>
            <div className="role-info">
              <p>
                <strong>Gameplay Focus:</strong> Scene analysis, lab interpretation
              </p>
              <p>
                <strong>Tools:</strong> UV scanner, DNA match system, analysis kit
              </p>
              <p>
                <strong>Challenges:</strong> Inconclusive evidence, contamination risk, lab deadlines
              </p>
            </div>
          </div>

          <div className="role">
            <Link href="/victim">
              <button className="role-button">Victim / Survivor</button>
            </Link>
            <div className="role-info">
              <p>
                <strong>Gameplay Focus:</strong> Emotional survival, flashbacks, escape routes
              </p>
              <p>
                <strong>Tools:</strong> Memory replay, intuition prompts
              </p>
              <p>
                <strong>Challenges:</strong> Trauma distortion, limited perspective, unpredictable danger
              </p>
            </div>
          </div>

          <div className="role">
            <Link href="/ai-profiler">
              <button className="role-button">AI Profiler</button>
            </Link>
            <div className="role-info">
              <p>
                <strong>Gameplay Focus:</strong> Psychological analysis, motive modeling
              </p>
              <p>
                <strong>Tools:</strong> Emotion heatmap, Suspect profiling matrix
              </p>
              <p>
                <strong>Challenges:</strong> Abstract data, deception, time pressure
              </p>
            </div>
          </div>
        </div>

        <Link href="/menu">
          <button className="back-button">← Back</button>
        </Link>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .page-container {
          background-image: url('/images/playmodes.png');
          background-color: #0b0b2e;
          font-family: 'Poppins', sans-serif;
          color: white;
          padding: 40px 20px;
          text-align: center;
          min-height: 100vh;
        }

        h1 {
          font-size: 2.8rem;
          color: #e0c2ff;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #ccc;
          margin-bottom: 50px;
        }

        .role-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 1000px;
          margin: auto;
        }

        .role {
          background: #1a1a40;
          background: rgba(26, 26, 64, 0.85);
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(122, 92, 255, 0.3);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 25px 30px;
          align-items: center;
          transition: transform 0.3s ease;
        }

        .role:hover {
          transform: scale(1.03);
        }

        .role-button {
          background-color: #7a5cff;
          color: white;
          padding: 18px 25px;
          border-radius: 12px;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          width: 200px;
          transition: background 0.3s, box-shadow 0.3s;
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.6), 0 0 10px rgba(255, 0, 0, 0.4) inset;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 1px;
        }

        .role-button:hover {
          background-color: #9e7bff;
          box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), 0 0 15px rgba(255, 0, 0, 0.6) inset;
        }

        .role-info {
          text-align: left;
          max-width: 700px;
          margin-left: 30px;
          font-size: 0.95rem;
        }

        .role-info p {
          margin: 8px 0;
          line-height: 1.6;
          background: #4a0313;
          padding: 10px 15px;
          border-left: 5px solid red;
          border-radius: 8px;
          color: #ffbcbc;
        }

        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: #ff4444;
          color: white;
          padding: 16px 28px;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(255, 68, 68, 0.6);
          transition: background-color 0.3s, box-shadow 0.3s;
        }

        .back-button:hover {
          background-color: #ff6666;
          box-shadow: 0 0 18px rgba(255, 68, 68, 0.8);
        }

        @media (max-width: 768px) {
          .role {
            flex-direction: column;
            text-align: center;
          }

          .role-info {
            margin-left: 0;
            margin-top: 15px;
          }
        }
      `}</style>
    </>
  )
}
