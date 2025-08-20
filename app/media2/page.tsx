"use client"

import Link from "next/link"

export default function Media2() {
  return (
    <>
      <div className="container">
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
        <Link href="/media1" className="nav-btn">
          ← Back
        </Link>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          padding: 0;
          background: linear-gradient(to bottom, #0a0a1a, #1a0040);
          font-family: 'Segoe UI', sans-serif;
          color: white;
        }

        .container {
          max-width: 1100px;
          margin: 100px auto 80px;
          padding: 20px;
        }

        .columns {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 30px;
        }

        .column {
          width: 300px;
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

        @media (max-width: 768px) {
          .columns {
            flex-direction: column;
            align-items: center;
          }

          .column {
            width: 90%;
          }
        }
      `}</style>
    </>
  )
}
