"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { ChevronLeft, ArrowLeft, Snowflake, Mountain } from "lucide-react"

// Types matching the UI structure
interface Dialogue {
  character: string
  speech: string
}
interface Clue {
  clue_id: string
  name: string
  description: string
}
interface Option {
  option_id: string
  description: string
  next_scene: string | null
  required_clues?: string[]
}
interface Scene {
  scene_id: string
  narration: string
  dialogues: Dialogue[]
  background_audio: string
  clues: Clue[]
  options: Option[]
}

// Types for the pasted-text dataset
interface PastedDecision {
  decision_id: string
  outcome_type: string
  description: string
  next_memory_id?: string | null
}
interface PastedMemory {
  memory_id: string
  internal_monologue: string
  emotional_state?: string
  trauma_distortion_level?: string
  decisions: PastedDecision[]
}
interface PastedStory {
  story: {
    scenario_name: string
    memories: PastedMemory[]
  }
}

// Fallback JSON from pasted-text (embedded so the UI always loads)
const pastedFallback: PastedStory = {
  story: {
    scenario_name: "Country Manor Murder",
    memories: [
      {
        memory_id: "memory_1",
        internal_monologue:
          "The polished oak floor gleamed under the flickering candlelight, reflecting the horrified faces surrounding my father's lifeless body.  A sickeningly sweet metallic scent hung in the air, mingling with the aroma of the half-eaten roast.  His eyes, wide and vacant, stared up at the ornate ceiling.  This can't be real. This isn't happening. I need to get out of here.  Is it really over?",
        decisions: [
          {
            decision_id: "decision_1",
            outcome_type: "TEMPORARY_SAFETY",
            description: "Attempt to call for help, ignoring the chaos.",
            next_memory_id: "memory_2",
          },
          {
            next_memory_id: "memory_3",
            description: "Stay with the body to help with the investigation.",
            decision_id: "decision_2",
            outcome_type: "DANGEROUS_CONFRONTATION",
          },
        ],
        trauma_distortion_level: "HIGH",
        emotional_state: "PANIC",
      },
      {
        memory_id: "memory_2",
        emotional_state: "FEAR",
        internal_monologue:
          "My hands trembled as I fumbled for my phone. The signal was weak, barely a whisper.  Each ring felt like an eternity.  Was anyone going to answer?  I could feel the eyes of my siblings on me, heavy with a mixture of shock and... something else?  Suspicion?  I had to get through. I had to get help. I had to escape this nightmare.",
        decisions: [
          {
            description: "Continue trying to call emergency services.",
            decision_id: "decision_3",
            outcome_type: "ESCAPE_ROUTE",
            next_memory_id: "memory_4",
          },
          {
            description: "Try to find a landline, hoping for a better connection.",
            next_memory_id: "memory_5",
            outcome_type: "TEMPORARY_SAFETY",
            decision_id: "decision_4",
          },
        ],
        trauma_distortion_level: "MEDIUM",
      },
      {
        memory_id: "memory_3",
        decisions: [
          {
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "decision_5",
            description: "Discreetly examine the body for clues.",
            next_memory_id: "memory_6",
          },
          {
            decision_id: "decision_6",
            next_memory_id: "memory_7",
            outcome_type: "TEMPORARY_SAFETY",
            description: "Wait for the authorities, trying not to give away any reactions.",
          },
        ],
        emotional_state: "CONFUSION",
        trauma_distortion_level: "LOW",
        internal_monologue:
          "I knelt beside my father, a strange calm settling over me as I fought the rising tide of panic.  The details swam into focus: a dark stain on his shirt, oddly precise, not like a random splash.  This was... planned.  My siblings watched, their expressions unreadable.  Was this a test?  What did they know? Was this something more?",
      },
      {
        emotional_state: "DETERMINATION",
        memory_id: "memory_4",
        decisions: [],
        internal_monologue:
          "Finally, the operator answered, my voice trembling, barely audible.  Relief flooded through me, a wave washing over the terror. Sirens in the distance became a beacon of hope. This could be my way out of this nightmare. I could finally escape.",
        trauma_distortion_level: "LOW",
      },
      {
        emotional_state: "FEAR",
        memory_id: "memory_5",
        trauma_distortion_level: "MEDIUM",
        internal_monologue:
          "The ancient landline seemed to crackle with static as I dialed, my hand shaking.  The old house felt oppressive, the silence broken only by the rhythmic tick-tock of a grandfather clock in the hall. It was as if the house itself held its breath, waiting. My hope was fading.",
        decisions: [
          {
            decision_id: "decision_7",
            outcome_type: "ESCAPE_ROUTE",
            description: "Try to get out of the house while the lines are busy.",
            next_memory_id: "memory_8",
          },
          {
            next_memory_id: "memory_9",
            description: "Wait for the authorities to come.",
            decision_id: "decision_8",
            outcome_type: "TEMPORARY_SAFETY",
          },
        ],
      },
      {
        memory_id: "memory_6",
        trauma_distortion_level: "LOW",
        internal_monologue:
          "My fingers brushed against the damp fabric of my father's shirt. The stain was darker than I thought, almost black.  A pinprick of blood welled on my fingertip.  I recoiled, fear twisting in my gut.  This wasn't an accident. This was murder.",
        decisions: [],
        emotional_state: "FEAR",
      },
      {
        emotional_state: "DETERMINATION",
        trauma_distortion_level: "LOW",
        memory_id: "memory_7",
        decisions: [],
        internal_monologue:
          "I forced myself to remain still, outwardly calm as the first police car screeched to a halt outside.  The flashing blue and red lights cast long, dancing shadows on the walls. The sight filled me with grim determination to get through this, to find justice for my father.",
      },
      {
        internal_monologue:
          "With a silent prayer, I slipped out the back door, my heart pounding a frantic rhythm against my ribs.  The cool night air was a stark contrast to the stifling atmosphere inside.  I ran, not looking back, until I was far away from the manor, and far from the horrors that awaited within.",
        trauma_distortion_level: "LOW",
        emotional_state: "FEAR",
        decisions: [],
        memory_id: "memory_8",
      },
      {
        decisions: [],
        trauma_distortion_level: "LOW",
        emotional_state: "CONFUSION",
        memory_id: "memory_9",
        internal_monologue:
          "The arrival of the police brought a semblance of order to the chaos.  The house, once a scene of horror, was now a crime scene, sterile and contained. While waiting, I started to replay events in my head and question all my siblings.",
      },
    ],
  },
}

// Map pasted-text memories/decisions into the Snowy Lodge scenes/options shape
function mapPastedToScenes(data: PastedStory): Scene[] {
  const memories = data?.story?.memories || []
  const idToSceneId = new Map<string, string>()
  const numbered = memories.map((m, idx) => {
    const num = m.memory_id?.split("_")[1]
    const sceneId = num ? `scene_${num}` : `scene_${idx + 1}`
    idToSceneId.set(m.memory_id, sceneId)
    return { memory: m, sceneId }
  })
  return numbered.map(({ memory, sceneId }, i) => {
    const options: Option[] = (memory.decisions || []).map((d, j) => {
      const next_scene = d.next_memory_id ? idToSceneId.get(d.next_memory_id) || null : null
      return {
        option_id: `opt_${sceneId.split("_")[1] || i + 1}_${j + 1}`,
        description: d.description,
        next_scene,
      }
    })
    return {
      scene_id: sceneId,
      narration: memory.internal_monologue,
      dialogues: [], // pasted-text has no dialogues
      background_audio: "mystery",
      clues: [], // none in pasted-text
      options,
    }
  })
}

// Dummy fetcher with simulated latency
const fetcher = async (url: string) => {
  await new Promise((r) => setTimeout(r, 800)) // simulate network delay
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load")
  return res.json()
}

export default function SnowyLodgePage() {
  const router = useRouter()

  const initialScenes = useMemo(() => mapPastedToScenes(pastedFallback), [])
  const [scenes, setScenes] = useState<Scene[]>(initialScenes)
  const [currentScene, setCurrentScene] = useState(scenes[0]?.scene_id || "scene_1")
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([])
  const [sceneHistory, setSceneHistory] = useState<string[]>([currentScene])

  // SWR-based dummy API call (no server route required; falls back to embedded data)
  const { data } = useSWR<PastedStory>("/api/snowy-lodge-story", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  // When data arrives, map and reset scene state
  useEffect(() => {
    if (!data) return
    try {
      const mapped = mapPastedToScenes(data)
      if (mapped.length) {
        setScenes(mapped)
        setCurrentScene(mapped[0].scene_id)
        setSceneHistory([mapped[0].scene_id])
        setDiscoveredClues([])
      }
    } catch {
      // ignore mapping errors and keep fallback
    }
  }, [data])

  const scene = scenes.find((s) => s.scene_id === currentScene)

  useEffect(() => {
    if (scene?.clues?.length) {
      setDiscoveredClues((prev) => {
        const existingIds = new Set(prev.map((c) => c.clue_id))
        const newClues = scene.clues.filter((c) => !existingIds.has(c.clue_id))
        return [...prev, ...newClues]
      })
    }
  }, [currentScene, scene])

  const handleOptionClick = (nextScene: string | null) => {
    if (nextScene) {
      setCurrentScene(nextScene)
      setSceneHistory((prev) => [...prev, nextScene])
    }
  }

  const handleBackClick = () => {
    if (sceneHistory.length > 1) {
      const newHistory = sceneHistory.slice(0, -1)
      const previousScene = newHistory[newHistory.length - 1]
      setSceneHistory(newHistory)
      setCurrentScene(previousScene)
    }
  }

  if (!scene) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center text-white">
        Scene not found
      </div>
    )
  }

  return (
    <div className="case-container">
      {/* Snow effect background */}
      <div className="snow-overlay">
        <div className="snowflake snowflake-1">
          <Snowflake className="w-4 h-4 text-white" />
        </div>
        <div className="snowflake snowflake-2">
          <Snowflake className="w-3 h-3 text-blue-200" />
        </div>
        <div className="snowflake snowflake-3">
          <Snowflake className="w-5 h-5 text-slate-300" />
        </div>
        <div className="snowflake snowflake-4">
          <Snowflake className="w-4 h-4 text-white" />
        </div>
        <div className="snowflake snowflake-5">
          <Snowflake className="w-3 h-3 text-blue-100" />
        </div>
        <div className="snowflake snowflake-6">
          <Snowflake className="w-4 h-4 text-slate-200" />
        </div>
      </div>

      <div className="scene-content">
        {/* Header */}
        <div className="case-header">
          <div className="header-title">
            <Mountain className="w-8 h-8 text-blue-300" />
            <h1>The Pine Ridge Lodge Mystery</h1>
            <Mountain className="w-8 h-8 text-blue-300" />
          </div>
          <p className="subtitle">A Locked-Room Murder in the Mountains</p>
        </div>

        {/* Previous Scene button */}
        {sceneHistory.length > 1 && (
          <button onClick={handleBackClick} className="scene-back-button">
            <ChevronLeft className="w-4 h-4" />
            Previous Scene
          </button>
        )}

        {/* Scene content */}
        <div className="scene-box">
          <div className="scene-narration">
            <h2 className="scene-title">Scene {currentScene.split("_")[1]}</h2>
            <p className="narration">{scene.narration}</p>
          </div>

          {/* Dialogues */}
          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3 className="section-title">Conversations:</h3>
              {scene.dialogues.map((dialogue, index) => (
                <div key={index} className="dialogue-item">
                  <p className="speaker-name">{dialogue.character}:</p>
                  <p className="dialogue-text">"{dialogue.speech}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Clues discovered */}
          {scene.clues && scene.clues.length > 0 && (
            <div className="clues-section">
              <h3 className="section-title">Evidence Discovered:</h3>
              <div className="clues-grid">
                {scene.clues.map((clue, index) => (
                  <span key={index} className="clue-tag" title={clue.description}>
                    {clue.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          <div className="options-section">
            <h3 className="section-title">Your Next Move:</h3>
            <div className="options-grid">
              {scene.options.map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(option.next_scene)} className="option-btn">
                  {option.description}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clues sidebar */}
        {discoveredClues.length > 0 && (
          <div className="evidence-sidebar">
            <h3 className="sidebar-title">Evidence Collected:</h3>
            <div className="evidence-grid">
              {discoveredClues.map((clue, index) => (
                <span key={index} className="evidence-tag" title={clue.description}>
                  {clue.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Return to Cases button - positioned at bottom-left */}
      <button onClick={() => router.back()} className="back-button">
        <ArrowLeft className="w-4 h-4" />
        Return to Cases
      </button>

      <style jsx>{`
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #312e81 100%);
          color: #f1f5f9;
          font-family: "Inter", sans-serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }

        .snow-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .snowflake {
          position: absolute;
          animation: snowfall 8s linear infinite;
        }

        .snowflake-1 { top: -10px; left: 10%; animation-delay: 0s; }
        .snowflake-2 { top: -10px; left: 30%; animation-delay: 2s; }
        .snowflake-3 { top: -10px; left: 50%; animation-delay: 4s; }
        .snowflake-4 { top: -10px; left: 70%; animation-delay: 1s; }
        .snowflake-5 { top: -10px; left: 20%; animation-delay: 3s; }
        .snowflake-6 { top: -10px; left: 80%; animation-delay: 5s; }

        @keyframes snowfall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        .scene-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(30, 58, 138, 0.3);
          border-radius: 15px;
          border: 2px solid #3b82f6;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
        }

        .header-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .case-header h1 {
          font-size: 2.8rem;
          margin: 0;
          color: #dbeafe;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          font-weight: 700;
        }

        .subtitle {
          color: #93c5fd;
          font-size: 1.2rem;
          font-style: italic;
          margin: 0;
        }

        .scene-back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(71, 85, 105, 0.5);
          color: #e2e8f0;
          border: 2px solid #475569;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          align-self: flex-start;
        }

        .scene-back-button:hover {
          background: #475569;
          color: white;
          transform: translateX(-3px);
          box-shadow: 0 4px 15px rgba(71, 85, 105, 0.4);
        }

        .scene-box {
          background: rgba(30, 41, 59, 0.8);
          padding: 30px;
          border-radius: 15px;
          border: 2px solid #475569;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }

        .scene-title {
          font-size: 2rem;
          margin: 0 0 20px 0;
          color: #dbeafe;
          font-weight: 600;
        }

        .narration {
          font-size: 1.2rem;
          line-height: 1.7;
          color: #f1f5f9;
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 1.4rem;
          color: #93c5fd;
          margin: 25px 0 15px 0;
          font-weight: 600;
        }

        .dialogue-section {
          margin: 25px 0;
        }

        .dialogue-item {
          background: rgba(59, 130, 246, 0.15);
          padding: 18px;
          border-radius: 10px;
          border-left: 4px solid #3b82f6;
          margin: 12px 0;
        }

        .speaker-name {
          font-weight: bold;
          color: #dbeafe;
          margin: 0 0 8px 0;
          font-size: 1.1rem;
        }

        .dialogue-text {
          font-style: italic;
          color: #f1f5f9;
          margin: 0;
          font-size: 1.05rem;
        }

        .clues-section {
          margin: 25px 0;
        }

        .clues-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .clue-tag {
          padding: 8px 16px;
          background: rgba(59, 130, 246, 0.3);
          color: #dbeafe;
          border-radius: 20px;
          font-size: 0.9rem;
          border: 1px solid #3b82f6;
        }

        .options-section {
          margin: 25px 0 0 0;
        }

        .options-grid {
          display: grid;
          gap: 15px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .option-btn {
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          color: white;
          border: none;
          padding: 18px 24px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .option-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
        }

        .evidence-sidebar {
          background: rgba(30, 41, 59, 0.9);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #60a5fa;
          box-shadow: 0 8px 32px rgba(96, 165, 250, 0.2);
          backdrop-filter: blur(10px);
        }

        .sidebar-title {
          color: #dbeafe;
          margin: 0 0 18px 0;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .evidence-tag {
          background: rgba(96, 165, 250, 0.2);
          padding: 10px;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          border: 1px solid #60a5fa;
          color: #f1f5f9;
        }

        .back-button {
          position: fixed;
          bottom: 25px;
          left: 25px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 2px solid #3b82f6;
          color: #dbeafe;
          padding: 15px 25px;
          border-radius: 30px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .back-button:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        @media (max-width: 768px) {
          .case-header h1 {
            font-size: 2.2rem;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .evidence-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }

          .case-container {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  )
}
