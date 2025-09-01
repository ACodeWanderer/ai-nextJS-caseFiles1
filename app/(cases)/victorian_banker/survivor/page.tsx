"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import Link from "next/link"

// --- Type Definitions for Incoming Data ---
interface Decision {
  decision_id: string
  next_memory_id: string
  description: string
  outcome_type: string
}

interface IntuitionPrompt {
  prompt_id: string
  prompt_text: string
}

interface Memory {
  memory_id: string
  internal_monologue: string
  decisions: Decision[]
  emotional_state: string
  trauma_distortion_level: string
  intuition_prompts?: IntuitionPrompt[]
}

interface SurvivorStoryData {
  story: {
    scenario_name: string
    memories: Memory[]
  }
}

// --- Type Definitions for UI Component ---
interface Clue {
  clue_id: string
  name: string
  description: string
}

interface Option {
  option_id: string
  next_scene: string
  description: string
}

interface Scene {
  scene_id: string
  narration: string
  options: Option[]
  clues?: Clue[]
  dialogues?: any[] // compatibility with the noir UI
}

interface NarrativeCaseData {
  title: string
  scenes: Scene[]
}

/**
 * Transforms survivor memory data into a narrative scene structure for the UI.
 */
const transformSurvivorData = (data: SurvivorStoryData | null): NarrativeCaseData | null => {
  if (!data) return null

  const scenes: Scene[] = data.story.memories.map((memory: Memory) => {
    const clues: Clue[] = []

    // Add psychological states as clues
    clues.push({
      clue_id: `${memory.memory_id}_emotion`,
      name: "Emotional State",
      description: memory.emotional_state,
    })
    clues.push({
      clue_id: `${memory.memory_id}_trauma`,
      name: "Trauma Distortion",
      description: `Level: ${memory.trauma_distortion_level}`,
    })

    // Add intuition prompts as clues
    if (memory.intuition_prompts) {
      memory.intuition_prompts.forEach((prompt) => {
        clues.push({
          clue_id: prompt.prompt_id,
          name: "Intuition",
          description: prompt.prompt_text,
        })
      })
    }

    return {
      scene_id: memory.memory_id,
      narration: memory.internal_monologue,
      options: memory.decisions.map((d) => ({
        option_id: d.decision_id,
        next_scene: d.next_memory_id,
        description: d.description,
      })),
      clues,
      dialogues: [],
    }
  })

  return {
    title: data.story.scenario_name || "Victorian Banker — Survivor POV",
    scenes,
  }
}

export default function VictorianBankerSurvivorPage() {
  const router = useRouter()

  const [survivorData, setSurvivorData] = useState<SurvivorStoryData | null>(null)
  const [currentScene, setCurrentScene] = useState<string>("")
  const [sceneHistory, setSceneHistory] = useState<string[]>([])
  const [discoveredInsights, setDiscoveredInsights] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true)
      try {
        // Dummy API call; replace when backend is ready
        const response = await axios.post<SurvivorStoryData>("http://localhost:8000/api/survivor-story", {
          case: "victorian_banker",
        })
        const loaded = response.data
        setSurvivorData(loaded)
        const firstId = loaded?.story?.memories?.[0]?.memory_id || ""
        setCurrentScene(firstId)
        setSceneHistory(firstId ? [firstId] : [])
      } catch (error) {
        console.warn("[victorian_banker] API failed. Using fallback JSON.", error)
        try {
          // Fallback to the exact JSON body you provided earlier
          const res = await fetch("/data/victorian-banker.json")
          const loaded = (await res.json()) as SurvivorStoryData
          setSurvivorData(loaded)
          const firstId = loaded?.story?.memories?.[0]?.memory_id || ""
          setCurrentScene(firstId)
          setSceneHistory(firstId ? [firstId] : [])
        } catch (fallbackErr) {
          console.error("[victorian_banker] Fallback load failed:", fallbackErr)
          setSurvivorData(null)
        }
      } finally {
        // Simulate network latency
        await new Promise((r) => setTimeout(r, 800))
        setIsLoading(false)
      }
    }
    fetchCaseData()
  }, [])

  const caseData = useMemo(() => transformSurvivorData(survivorData), [survivorData])
  const scene = caseData?.scenes.find((s) => s.scene_id === currentScene)

  const handleOptionClick = (option: Option) => {
    if (scene?.clues) {
      const newClueIds = scene.clues.map((clue) => clue.clue_id)
      setDiscoveredInsights((prev) => [...new Set([...prev, ...newClueIds])])
    }

    if (scene?.options.length === 0) {
      alert(`Outcome: ${scene.narration}`)
      return
    }

    setSceneHistory((prev) => [...prev, option.next_scene])
    setCurrentScene(option.next_scene)
  }

  const handleBackToScene = () => {
    if (sceneHistory.length > 1) {
      const newHistory = [...sceneHistory]
      newHistory.pop()
      const previousScene = newHistory[newHistory.length - 1]
      setSceneHistory(newHistory)
      setCurrentScene(previousScene)
    }
  }

  if (isLoading || !caseData) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Recalling a fractured account...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #000000, #1f2937);
            color: #00bfff;
            font-family: "Crimson Text", serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 191, 255, 0.3);
            border-top: 3px solid #00bfff;
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

  if (!scene) {
    return (
      <div className="error-screen">
        <h2>Memory Corrupted</h2>
        <Link href="/">Try to remember again</Link>
        <style jsx>{`
          .error-screen {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #0f0f23;
            color: #e2e8f0;
            font-family: "Crimson Text", serif;
          }
          h2 { color: #00bfff; }
        `}</style>
      </div>
    )
  }

  // Add final scene's insights if no options remain
  if (scene.options.length === 0 && scene.clues) {
    const newClueIds = scene.clues.map((clue) => clue.clue_id)
    if (!newClueIds.every((id) => discoveredInsights.includes(id))) {
      setDiscoveredInsights((prev) => [...new Set([...prev, ...newClueIds])])
    }
  }

  return (
    <>
      <div className="case-container">
        <div className="noir-overlay"></div>
        <div className="case-header">
          <h1>{caseData.title}</h1>
          <div className="clues-counter">Insights Gained: {discoveredInsights.length}</div>
        </div>

        <div className="scene-content">
          {sceneHistory.length > 1 && scene.options.length > 0 && (
            <button className="scene-back-button" onClick={handleBackToScene}>
              ← Reconsider
            </button>
          )}

          <div className="narration-box">
            <h3>🧠 Internal Monologue</h3>
            <p className="narration">{scene.narration}</p>
          </div>

          {scene.clues && scene.clues.length > 0 && (
            <div className="clues-section">
              <h3>⚡️ Insights & Intuitions</h3>
              {scene.clues.map((clue) => (
                <div key={clue.clue_id} className="clue-item">
                  <strong>{clue.name}</strong>
                  <p>{clue.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="options-section">
            <h3>🤔 What do you do?</h3>
            <div className="options-grid">
              {scene.options.length > 0 ? (
                scene.options.map((option) => (
                  <button key={option.option_id} className="option-btn" onClick={() => handleOptionClick(option)}>
                    {option.description}
                  </button>
                ))
              ) : (
                <div className="ending-narration">
                  <p>This is the end of the memory.</p>
                  <button className="back-button" onClick={() => router.back()}>
                    Awaken
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {discoveredInsights.length > 0 && (
          <div className="evidence-sidebar">
            <h3>📋 Memory Fragments</h3>
            <div className="evidence-list">
              {discoveredInsights.map((clueId, index) => {
                const clue = caseData.scenes.flatMap((s) => s.clues || []).find((c) => c && c.clue_id === clueId)
                return clue ? (
                  <div key={index} className="evidence-item">
                    <strong>{clue.name}</strong>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        <button className="back-button main-back" onClick={() => router.back()}>
          ← Fade to Black
        </button>
      </div>

      <style jsx>{`
        /* Visual parity with the noir case */
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          color: #e2e8f0;
          font-family: "Crimson Text", serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }
        .noir-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(0,191,255,0.1) 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 20%, rgba(138,43,226,0.05) 0%, transparent 50%),
                      radial-gradient(ellipse at 40% 80%, rgba(0,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
          animation: noirDrift 25s ease-in-out infinite;
        }
        @keyframes noirDrift {
          0%, 100% { opacity: 0.4; transform: translateX(0px); }
          50% { opacity: 0.7; transform: translateX(15px); }
        }
        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(0, 191, 255, 0.15);
          border-radius: 15px;
          border: 2px solid #00bfff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          font-size: 2.8rem;
          margin: 0 0 10px 0;
          color: #00bfff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          font-weight: 700;
        }
        .clues-counter {
          font-size: 1.2rem;
          color: #00ffff;
          font-weight: 600;
        }
        .scene-content {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .narration-box,
        .dialogue-section,
        .clues-section,
        .options-section {
          background: rgba(26, 26, 46, 0.8);
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #00bfff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(5px);
        }
        .narration-box h3,
        .dialogue-section h3,
        .clues-section h3,
        .options-section h3 {
          margin: 0 0 18px 0;
          color: #00bfff;
          font-size: 1.4rem;
          font-weight: 600;
        }
        .narration {
          font-size: 1.15rem;
          line-height: 1.7;
          font-style: italic;
          color: #cbd5e0;
        }
        .clues-section {
          border-left-color: #00ffff;
          background: rgba(0, 255, 255, 0.1);
        }
        .clue-item {
          background: rgba(0, 191, 255, 0.15);
          padding: 18px;
          border-radius: 10px;
          margin: 12px 0;
          border: 2px solid #00ffff;
          box-shadow: 0 2px 10px rgba(0, 255, 255, 0.2);
        }
        .clue-item strong {
          color: #00bfff;
          display: block;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }
        .options-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .option-btn {
          background: linear-gradient(45deg, #00bfff, #8a2be2);
          color: white;
          border: none;
          padding: 18px 24px;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          font-family: "Crimson Text", serif;
          box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
        }
        .option-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 191, 255, 0.4);
          background: linear-gradient(45deg, #00ffff, #9370db);
        }
        .evidence-sidebar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          background: rgba(15, 15, 35, 0.95);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #00ffff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
        }
        .evidence-sidebar h3 {
          color: #00bfff;
          margin: 0 0 18px 0;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
        }
        .evidence-item {
          background: rgba(0, 255, 255, 0.15);
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          font-size: 0.95rem;
          border-left: 3px solid #00ffff;
        }
        .evidence-item strong {
          color: #e2e8f0;
        }
        .back-button.main-back {
          position: fixed;
          bottom: 25px;
          left: 25px;
        }
        .back-button {
          background-color: transparent;
          border: 2px solid #00bfff;
          color: #00bfff;
          padding: 15px 25px;
          border-radius: 30px;
          font-size: 1.05rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          font-family: "Crimson Text", serif;
          cursor: pointer;
        }
        .back-button:hover {
          background-color: #00bfff;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4);
        }
        .scene-back-button {
          background: rgba(0, 191, 255, 0.1);
          color: #00bfff;
          border: 2px solid #00bfff;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: "Crimson Text", serif;
          margin-bottom: 20px;
          align-self: flex-start;
        }
        .scene-back-button:hover {
          background: #00bfff;
          color: white;
          transform: translateX(3px);
          box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4);
        }
        .ending-narration {
          text-align: center;
          color: #cbd5e0;
          font-style: italic;
          font-size: 1.2rem;
        }
        .ending-narration .back-button {
          position: static;
          margin-top: 20px;
        }
        @media (max-width: 768px) {
          .evidence-sidebar {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            width: 100%;
            margin-top: 25px;
          }
          .case-header h1 {
            font-size: 2.2rem;
          }
          .options-grid {
            grid-template-columns: 1fr;
          }
          .case-container {
            padding: 15px;
          }
        }
      `}</style>
    </>
  )
}
