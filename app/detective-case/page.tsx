"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

// Mock data based on the provided structure
const mockCaseData = {
  title: "The Banker's Secret",
  scenes: [
    {
      scene_id: "scene_1",
      narration: "A storm brews over London. Inspector Lestrade knocks at 221B Baker Street with a troubling case.",
      dialogues: [
        { character: "Lestrade", speech: "A banker has been found dead in his study. No signs of forced entry." },
        { character: "Holmes", speech: "Let us waste no time, Watson. The game is afoot." },
      ],
      background_audio: "rain",
      options: [
        { option_id: "go_scene_2", description: "Visit the crime scene", next_scene: "scene_2" },
        { option_id: "go_scene_3", description: "Interview the banker's family", next_scene: "scene_3" },
      ],
    },
    {
      scene_id: "scene_2",
      narration: "The banker lies slumped over his desk, papers scattered. Something feels off.",
      dialogues: [{ character: "Watson", speech: "Curious… the ink is fresh but no pen in sight." }],
      background_audio: "crime_scene",
      clues: [
        {
          clue_id: "missing_pen",
          name: "Missing Fountain Pen",
          description: "The banker's fountain pen is missing though ink was freshly used.",
        },
      ],
      options: [
        { option_id: "examine_desk", description: "Examine the desk more closely", next_scene: "scene_4" },
        {
          option_id: "question_secretary",
          description: "Question the secretary",
          next_scene: "scene_5",
          required_clues: ["missing_pen"],
        },
      ],
    },
    {
      scene_id: "scene_3",
      narration: "The widow sobs quietly in the drawing room.",
      dialogues: [{ character: "Widow", speech: "He seemed troubled these past weeks, but he wouldn't tell me why." }],
      background_audio: "tension",
      options: [{ option_id: "return_to_scene_2", description: "Go to the crime scene", next_scene: "scene_2" }],
    },
    {
      scene_id: "scene_4",
      narration: "Upon closer inspection, you notice a hidden compartment in the desk drawer.",
      dialogues: [{ character: "Holmes", speech: "Ah! What secrets did our banker hide?" }],
      background_audio: "discovery",
      clues: [
        {
          clue_id: "secret_documents",
          name: "Secret Documents",
          description: "Financial records showing suspicious transactions.",
        },
      ],
      options: [{ option_id: "analyze_documents", description: "Analyze the documents", next_scene: "scene_6" }],
    },
    {
      scene_id: "scene_5",
      narration: "The secretary nervously adjusts her glasses as you approach.",
      dialogues: [
        {
          character: "Secretary",
          speech: "I... I saw him writing frantically before he died. Then the pen just vanished!",
        },
      ],
      background_audio: "tension",
      options: [{ option_id: "press_further", description: "Press for more details", next_scene: "scene_6" }],
    },
    {
      scene_id: "scene_6",
      narration: "The pieces of the puzzle begin to fall into place. The truth emerges.",
      dialogues: [
        { character: "Holmes", speech: "The banker discovered embezzlement in his own bank. Someone silenced him." },
      ],
      background_audio: "revelation",
      options: [{ option_id: "solve_case", description: "Solve the case", next_scene: "ending" }],
    },
  ],
}

export default function DetectiveCasePage() {
  const [currentScene, setCurrentScene] = useState("scene_1")
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([])
  const [caseData, setCaseData] = useState(mockCaseData)
  const [isLoading, setIsLoading] = useState(false)

  // Mock API call to fetch case data
  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCaseData(mockCaseData)
      setIsLoading(false)
    }

    fetchCaseData()
  }, [])

  const getCurrentSceneData = () => {
    return caseData.scenes.find((scene) => scene.scene_id === currentScene)
  }

  const handleOptionClick = (option: any) => {
    // Check if option requires clues
    if (option.required_clues) {
      const hasRequiredClues = option.required_clues.every((clue: string) => discoveredClues.includes(clue))
      if (!hasRequiredClues) {
        alert("You need more evidence before choosing this option!")
        return
      }
    }

    // Add clues from current scene if any
    const scene = getCurrentSceneData()
    if (scene?.clues) {
      const newClues = scene.clues.map((clue) => clue.clue_id)
      setDiscoveredClues((prev) => [...new Set([...prev, ...newClues])])
    }

    if (option.next_scene === "ending") {
      alert("Case Solved! The banker was murdered to cover up embezzlement.")
      return
    }

    setCurrentScene(option.next_scene)
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your case...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #0b0b2e, #1a1a4a);
            color: white;
            font-family: 'Orbitron', monospace;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(122, 92, 255, 0.3);
            border-top: 3px solid #7a5cff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  const scene = getCurrentSceneData()

  if (!scene) {
    return (
      <div className="error-screen">
        <h2>Scene not found</h2>
        <Link href="/detective">Return to Detective</Link>
      </div>
    )
  }

  return (
    <>
      <div className="case-container">
        <div className="case-header">
          <h1>{caseData.title}</h1>
          <div className="clues-counter">Clues Found: {discoveredClues.length}</div>
        </div>

        <div className="scene-content">
          <div className="narration-box">
            <h3>Scene</h3>
            <p className="narration">{scene.narration}</p>
          </div>

          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3>Dialogue</h3>
              {scene.dialogues.map((dialogue, index) => (
                <div key={index} className="dialogue-item">
                  <span className="character-name">{dialogue.character}:</span>
                  <span className="speech">"{dialogue.speech}"</span>
                </div>
              ))}
            </div>
          )}

          {scene.clues && scene.clues.length > 0 && (
            <div className="clues-section">
              <h3>🔍 Evidence Found</h3>
              {scene.clues.map((clue, index) => (
                <div key={index} className="clue-item">
                  <strong>{clue.name}</strong>
                  <p>{clue.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="options-section">
            <h3>What do you do next?</h3>
            <div className="options-grid">
              {scene.options.map((option, index) => {
                const isDisabled =
                  option.required_clues &&
                  !option.required_clues.every((clue: string) => discoveredClues.includes(clue))

                return (
                  <button
                    key={index}
                    className={`option-btn ${isDisabled ? "disabled" : ""}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={isDisabled}
                  >
                    {option.description}
                    {isDisabled && <span className="locked-icon">🔒</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {discoveredClues.length > 0 && (
          <div className="evidence-sidebar">
            <h3>Evidence Collected</h3>
            <div className="evidence-list">
              {discoveredClues.map((clueId, index) => {
                const clue = caseData.scenes.flatMap((s) => s.clues || []).find((c) => c.clue_id === clueId)
                return clue ? (
                  <div key={index} className="evidence-item">
                    <strong>{clue.name}</strong>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        <Link href="/detective" className="back-button">
          ← Back to Detective
        </Link>
      </div>

      <style jsx>{`
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0b0b2e, #1a1a4a);
          color: white;
          font-family: 'Orbitron', monospace;
          padding: 20px;
          position: relative;
        }

        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(122, 92, 255, 0.1);
          border-radius: 15px;
          border: 2px solid #7a5cff;
        }

        .case-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          color: #7a5cff;
          text-shadow: 0 0 10px rgba(122, 92, 255, 0.5);
        }

        .clues-counter {
          font-size: 1.1rem;
          color: #ffd700;
        }

        .scene-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .narration-box, .dialogue-section, .clues-section, .options-section {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #7a5cff;
        }

        .narration-box h3, .dialogue-section h3, .clues-section h3, .options-section h3 {
          margin: 0 0 15px 0;
          color: #7a5cff;
          font-size: 1.3rem;
        }

        .narration {
          font-size: 1.1rem;
          line-height: 1.6;
          font-style: italic;
        }

        .dialogue-item {
          margin: 10px 0;
          padding: 10px;
          background: rgba(122, 92, 255, 0.1);
          border-radius: 8px;
        }

        .character-name {
          font-weight: bold;
          color: #ffd700;
          margin-right: 10px;
        }

        .speech {
          font-style: italic;
        }

        .clues-section {
          border-left-color: #ffd700;
        }

        .clue-item {
          background: rgba(255, 215, 0, 0.1);
          padding: 15px;
          border-radius: 8px;
          margin: 10px 0;
          border: 1px solid #ffd700;
        }

        .clue-item strong {
          color: #ffd700;
          display: block;
          margin-bottom: 5px;
        }

        .options-grid {
          display: grid;
          gap: 15px;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .option-btn {
          background: linear-gradient(45deg, #7a5cff, #9d7bff);
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          font-family: 'Orbitron', monospace;
        }

        .option-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(122, 92, 255, 0.4);
        }

        .option-btn.disabled {
          background: #444;
          color: #888;
          cursor: not-allowed;
        }

        .locked-icon {
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 0.8rem;
        }

        .evidence-sidebar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 250px;
          background: rgba(0, 0, 0, 0.8);
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #ffd700;
        }

        .evidence-sidebar h3 {
          color: #ffd700;
          margin: 0 0 15px 0;
          text-align: center;
        }

        .evidence-item {
          background: rgba(255, 215, 0, 0.1);
          padding: 8px;
          margin: 5px 0;
          border-radius: 5px;
          font-size: 0.9rem;
        }

        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background-color: transparent;
          border: 2px solid #7a5cff;
          color: #7a5cff;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.3s ease;
          font-family: 'Orbitron', monospace;
        }

        .back-button:hover {
          background-color: #7a5cff;
          color: white;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .evidence-sidebar {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            width: 100%;
            margin-top: 20px;
          }
          
          .case-header h1 {
            font-size: 2rem;
          }
          
          .options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
