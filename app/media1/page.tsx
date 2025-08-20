"use client"

import Link from "next/link"

export default function Media1Page() {
  const handlePlayMedia = () => {
    alert("Play Media")
  }

  return (
    <div>
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0a0a1a, #1a0040);
          font-family: 'Segoe UI', sans-serif;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .container {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0a0a1a, #1a0040);
          font-family: 'Segoe UI', sans-serif;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;

          background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), 
              url('/images/media1.png'); 

          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          min-height: 100vh;
        }

        h1 {
          font-size: 2.8em;
          font-weight: 900;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-top: 60px;
          margin-bottom: 20px;
          text-shadow: 2px 2px 8px black;
          text-align: center;
        }

        p.subtitle {
          font-size: 1.1em;
          max-width: 800px;
          text-align: center;
          color: #ffffff;
          letter-spacing: 1px;
          margin-bottom: 50px;
          font-style: italic;
        }

        .video-box {
          border: 4px solid #ff00ff;
          padding: 20px;
          width: 600px;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 25px #ff00ff;
          border-radius: 8px;
          margin-bottom: 100px;
        }

        .play-icon {
          width: 80px;
          height: 80px;
          border: 3px solid #ff00ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .play-icon:hover {
          transform: scale(1.1);
        }

        .play-icon::before {
          content: '';
          position: absolute;
          left: 32%;
          top: 25%;
          width: 0;
          height: 0;
          border-left: 20px solid #ff00ff;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
        }

        .section-two {
          width: 100%;
          padding: 60px 20px 100px;
          background: linear-gradient(to bottom, #0a0a1a, #1a0040);
        }

        .columns {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          max-width: 1100px;
          margin: auto;
        }

        .column {
          width: 300px;
          margin: 20px;
        }

        .column h2 {
          font-size: 1.2em;
          font-weight: bold;
          color: white;
          text-align: center;
          margin-bottom: 20px;
          text-transform: uppercase;
          text-shadow: 0 0 10px #ff00ff;
          position: relative;
        }

        .column h2::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 2px;
          background: linear-gradient(to right, transparent, #ff00ff, transparent);
        }

        .item {
          margin: 10px 0;
          display: flex;
          align-items: center;
          font-size: 1em;
          color: #f0f0f0;
        }

        .item::before {
          content: '▶';
          color: #ff00ff;
          margin-right: 10px;
          font-size: 0.9em;
        }

        .navigation-buttons {
          width: 100%;
          display: flex;
          justify-content: space-between;
          position: fixed;
          bottom: 30px;
          padding: 0 30px;
        }

        .nav-btn {
          background: none;
          border: none;
          font-size: 1.2em;
          font-weight: bold;
          color: white;
          cursor: pointer;
          text-shadow: 1px 1px 4px black;
          text-decoration: none;
        }

        .nav-btn:hover {
          color: #ff00ff;
        }

        @media (max-width: 700px) {
          .video-box {
            width: 90%;
            height: 220px;
          }

          .play-icon {
            width: 60px;
            height: 60px;
          }

          .play-icon::before {
            border-left: 15px solid #ff00ff;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
          }

          p.subtitle {
            font-size: 0.95em;
            padding: 0 10px;
          }

          .columns {
            flex-direction: column;
            align-items: center;
          }

          .column {
            width: 90%;
          }
        }
      `}</style>

      <div className="container">
        {/* Section 1 */}
        <h1>STEP INSIDE THE SIMULATION</h1>
        <p className="subtitle">
          Dive into trailers, behind-the-scenes footage, case explorations, and dev logs to uncover how Casefiles comes
          alive.
        </p>

        <div className="video-box">
          <div className="play-icon" onClick={handlePlayMedia}></div>
        </div>

        {/* Section 2 */}
        <div className="section-two">
          <div className="columns">
            {/* Column 1 */}
            <div className="column">
              <h2>Behind The Scenes</h2>
              <div className="item">Designing AI Dialogues</div>
              <div className="item">Building a Crime Scene in VR</div>
            </div>

            {/* Column 2 */}
            <div className="column">
              <h2>Dev Talks</h2>
              <div className="item">Meet the Story Team</div>
              <div className="item">AI + Criminology: Ethical Design</div>
            </div>

            {/* Column 3 */}
            <div className="column">
              <h2>Case Features</h2>
              <div className="item">Zodiac Case — Timeline Breakdown</div>
              <div className="item">Crimson Alley: Narrative Flow Demo</div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <Link href="/menu" className="nav-btn">
            ← Back
          </Link>
          <Link href="/media2" className="nav-btn">
            Next →
          </Link>
        </div>
      </div>
    </div>
  )
}
