"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

// Types aligned with the noir survivor example.
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
    scenario_name?: string
    // Some payloads provide a single memory at the top-level of `story`
    // while others provide `memories: Memory[]`.
    // We'll normalize both shapes.
    memory_id?: string
    internal_monologue?: string
    emotional_state?: string
    trauma_distortion_level?: string
    decisions?: Decision[]
    memories?: Memory[]
  }
}

// Narrative/scene model for the UI.
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
}

interface NarrativeCaseData {
  title: string
  scenes: Scene[]
}

// This is intentionally minimal; the normalizer will convert it into a memories array.
const fallbackRaw: SurvivorStoryData = {
  story: {
    emotional_state: "FEAR",
    trauma_distortion_level: "MEDIUM",
    internal_monologue:
      "The polished oak floor gleamed under the flickering gaslight, reflecting the horrified faces gathered around… him. My father. Lying there, still, the crimson stain spreading like a malevolent flower across his crisp shirt. My breath hitched, a strangled sob caught in my throat. Was it the wine? Or the look in my brother Edward’s eyes? Or was it the way my sister, Clara, clutched her pearls, her usually perfect composure shattered? I should feel grief, overwhelming grief, but a cold dread is settling over me. Someone in this room killed him.",
    memory_id: "memory_1",
    decisions: [
      {
        next_memory_id: "memory_2",
        description: "Approach the body, ignoring the unsettling feeling.",
        outcome_type: "DANGEROUS_CONFRONTATION",
        decision_id: "decision_1",
      },
      {
        decision_id: "decision_2",
        next_memory_id: "memory_3",
        description: "Stay back, observe the others, try to find clues.",
        outcome_type: "TEMPORARY_SAFETY",
      },
    ],
  },
}

function normalizeSurvivorPayload(input: SurvivorStoryData | null): SurvivorStoryData | null {
  if (!input || !input.story) return input
  const s = input.story

  if (Array.isArray(s.memories) && s.memories.length > 0) return input

  // If the payload is the compact form (top-level memory fields), wrap as a single memory.
  const singleMemory: Memory | null =
    s.memory_id && s.internal_monologue && s.emotional_state && s.trauma_distortion_level
      ? {
          memory_id: s.memory_id,
          internal_monologue: s.internal_monologue,
          emotional_state: s.emotional_state,
          trauma_distortion_level: s.trauma_distortion_level,
          decisions: s.decisions ?? [],
        }
      : null

  return {
    story: {
      scenario_name: s.scenario_name ?? "Snowy Lodge Survivor",
      memories: singleMemory ? [singleMemory] : [],
    },
  }
}

function transformSurvivorData(data: SurvivorStoryData | null): NarrativeCaseData | null {
  if (!data || !data.story || !data.story.memories) return null

  const scenes: Scene[] = data.story.memories.map((memory: Memory) => {
    const clues: Clue[] = [
      {
        clue_id: `${memory.memory_id}_emotion`,
        name: "Emotional State",
        description: memory.emotional_state,
      },
      {
        clue_id: `${memory.memory_id}_trauma`,
        name: "Trauma Distortion",
        description: `Level: ${memory.trauma_distortion_level}`,
      },
    ]

    if (memory.intuition_prompts) {
      for (const p of memory.intuition_prompts) {
        clues.push({
          clue_id: p.prompt_id,
          name: "Intuition",
          description: p.prompt_text,
        })
      }
    }

    return {
      scene_id: memory.memory_id,
      narration: memory.internal_monologue,
      options: (memory.decisions || []).map((d) => ({
        option_id: d.decision_id,
        next_scene: d.next_memory_id,
        description: d.description,
      })),
      clues,
    }
  })

  return {
    title: data.story.scenario_name || "Snowy Lodge Survivor",
    scenes,
  }
}

export default function SnowyLodgeSurvivorPage() {
  const router = useRouter()
  const [survivorData, setSurvivorData] = useState<SurvivorStoryData | null>(null)
  const [currentScene, setCurrentScene] = useState<string | null>(null)
  const [sceneHistory, setSceneHistory] = useState<string[]>([])
  const [discoveredInsightIds, setDiscoveredInsightIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await axios.post<SurvivorStoryData>("/api/survivor-story", {
          case: "snowy_lodge",
        })
        setSurvivorData(res.data)
      } catch (err) {
        console.warn("[v0] survivor API failed, using fallback:", err)
        setSurvivorData(fallbackRaw)
      } finally {
        // small UX delay
        await new Promise((r) => setTimeout(r, 700))
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const normalized = useMemo(() => normalizeSurvivorPayload(survivorData), [survivorData])
  const caseData = useMemo(() => transformSurvivorData(normalized), [normalized])

  useEffect(() => {
    if (!currentScene && caseData?.scenes?.length) {
      const firstId = caseData.scenes[0].scene_id
      setCurrentScene(firstId)
      setSceneHistory([firstId])
    }
  }, [caseData, currentScene])

  const scene = useMemo(
    () => caseData?.scenes.find((s) => s.scene_id === currentScene) ?? null,
    [caseData, currentScene],
  )

  useEffect(() => {
    if (!scene?.clues) return
    const newIds = scene.clues.map((c) => c.clue_id)
    setDiscoveredInsightIds((prev) => [...new Set([...prev, ...newIds])])
  }, [scene?.scene_id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoose = (opt: Option) => {
    setCurrentScene(opt.next_scene)
    setSceneHistory((prev) => [...prev, opt.next_scene])
  }

  const handleReconsider = () => {
    if (sceneHistory.length <= 1) return
    const newHistory = sceneHistory.slice(0, -1)
    const prevId = newHistory[newHistory.length - 1]
    setSceneHistory(newHistory)
    setCurrentScene(prevId)
  }

  if (isLoading || !caseData || !currentScene) {
    return (
      <div className="loading-screen">
        <div className="snow-spinner" />
        <p>Memories stirring beneath the snow...</p>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0b1220, #1e293b);
            color: #e5f0ff;
            font-family: "Crimson Text", serif;
          }
          .snow-spinner {
            width: 56px;
            height: 56px;
            border: 3px solid rgba(96, 165, 250, 0.3);
            border-top-color: #60a5fa;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    )
  }

  if (!scene) {
    return (
      <div className="error-screen">
        <h2>Memory lost in the storm</h2>
        <button className="back-button" onClick={() => router.back()}>
          Return to warmth
        </button>
        <style jsx>{`
          .error-screen {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #0b1220, #1e293b);
            color: #e5f0ff;
            font-family: "Crimson Text", serif;
            gap: 12px;
          }
          .back-button {
            background: transparent;
            border: 2px solid #60a5fa;
            color: #e5f0ff;
            padding: 10px 18px;
            border-radius: 999px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .back-button:hover {
            background: #60a5fa;
            color: #0b1220;
          }
        `}</style>
      </div>
    )
  }

  const isEnding = scene.options.length === 0

  return (
    <>
      <div className="case-container">
        <div className="snow-overlay" aria-hidden="true" />

        <header className="case-header">
          <h1>{caseData.title}</h1>
          <p className="subtitle">A survivor’s account amidst the drifts</p>
          <div className="insight-counter">Insights: {discoveredInsightIds.length}</div>
        </header>

        <main className="scene-wrap">
          {sceneHistory.length > 1 && !isEnding && (
            <button className="scene-back" onClick={handleReconsider}>
              ← Reconsider
            </button>
          )}

          <section className="narration-box">
            <h3 className="section-title">Internal Monologue</h3>
            <p className="narration">{scene.narration}</p>
          </section>

          {scene.clues && scene.clues.length > 0 && (
            <section className="clues-box">
              <h3 className="section-title">Insights & Intuitions</h3>
              <div className="clues-list">
                {scene.clues.map((c) => (
                  <div className="clue-item" key={c.clue_id}>
                    <strong>{c.name}</strong>
                    <p>{c.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="options-box">
            <h3 className="section-title">{isEnding ? "The Memory Fades" : "What do you do?"}</h3>
            {!isEnding ? (
              <div className="options-grid">
                {scene.options.map((o) => (
                  <button key={o.option_id} className="option-btn" onClick={() => handleChoose(o)}>
                    {o.description}
                  </button>
                ))}
              </div>
            ) : (
              <div className="ending-wrap">
                <p className="ending-text">This memory reaches its end.</p>
                <button className="back-main" onClick={() => router.back()}>
                  Leave the storm
                </button>
              </div>
            )}
          </section>
        </main>

        {discoveredInsightIds.length > 0 && (
          <aside className="evidence-panel" aria-label="Collected Memory Fragments">
            <h3>Memory Fragments</h3>
            <div className="frag-list">
              {discoveredInsightIds.map((id) => {
                const clue = caseData.scenes.flatMap((s) => s.clues || []).find((c) => c.clue_id === id)
                if (!clue) return null
                return (
                  <div key={id} className="frag-item">
                    {clue.name}
                  </div>
                )
              })}
            </div>
          </aside>
        )}

        <button className="leave-btn" onClick={() => router.back()}>
          ← Return to Cases
        </button>
      </div>

      <style jsx>{`
        /* Color system: 
           Primary: #60a5fa (sky blue)
           Neutrals: #0b1220, #1e293b, #e5f0ff
           Accent: #22d3ee (cyan)
           No gradients beyond subtle backgrounds; strong contrast maintained. */

        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0b1220 0%, #1e293b 50%, #0b1220 100%);
          color: #e5f0ff;
          font-family: "Crimson Text", serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }

        .snow-overlay {
          pointer-events: none;
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle at 30% -10%, rgba(96, 165, 250, 0.12), transparent 50%),
            radial-gradient(circle at 80% 0%, rgba(34, 211, 238, 0.08), transparent 40%),
            radial-gradient(circle at 60% 100%, rgba(96, 165, 250, 0.08), transparent 60%);
          animation: drift 22s ease-in-out infinite;
        }
        @keyframes drift {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.85;
          }
          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }

        .case-header {
          text-align: center;
          margin: 0 auto 24px;
          padding: 20px;
          max-width: 900px;
          background: rgba(15, 23, 42, 0.7);
          border: 2px solid #60a5fa;
          border-radius: 14px;
          box-shadow: 0 8px 28px rgba(96, 165, 250, 0.2);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          margin: 0 0 6px 0;
          font-size: 2.4rem;
          color: #e5f0ff;
        }
        .subtitle {
          margin: 0 0 8px 0;
          color: #cfe6ff;
          font-style: italic;
        }
        .insight-counter {
          font-weight: 600;
          color: #22d3ee;
        }

        .scene-wrap {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }
        .scene-back {
          align-self: flex-start;
          background: rgba(96, 165, 250, 0.12);
          color: #e5f0ff;
          border: 2px solid #60a5fa;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .scene-back:hover {
          background: #60a5fa;
          color: #0b1220;
          transform: translateX(-2px);
        }

        .section-title {
          margin: 0 0 10px 0;
          color: #60a5fa;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .narration-box,
        .clues-box,
        .options-box {
          background: rgba(15, 23, 42, 0.78);
          border: 1.5px solid rgba(96, 165, 250, 0.35);
          border-left: 4px solid #60a5fa;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
          padding: 20px;
          border-radius: 14px;
          backdrop-filter: blur(6px);
        }

        .narration {
          color: #e5f0ff;
          line-height: 1.7;
          font-size: 1.1rem;
          font-style: italic;
        }

        .clues-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
        .clue-item {
          background: rgba(34, 211, 238, 0.08);
          border: 1.5px solid rgba(34, 211, 238, 0.45);
          padding: 12px;
          border-radius: 10px;
        }
        .clue-item strong {
          color: #e5f0ff;
          display: block;
          margin-bottom: 6px;
        }
        .clue-item p {
          margin: 0;
          color: #cfe6ff;
        }

        .options-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .option-btn {
          background: linear-gradient(135deg, #60a5fa, #22d3ee);
          color: #0b1220;
          border: none;
          padding: 16px 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(96, 165, 250, 0.25);
          transition: all 0.2s ease;
        }
        .option-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(34, 211, 238, 0.28);
        }

        .ending-wrap {
          text-align: center;
        }
        .ending-text {
          color: #cfe6ff;
          font-style: italic;
          margin-bottom: 12px;
        }
        .back-main,
        .leave-btn {
          background: transparent;
          border: 2px solid #60a5fa;
          color: #e5f0ff;
          padding: 10px 18px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .back-main:hover,
        .leave-btn:hover {
          background: #60a5fa;
          color: #0b1220;
        }

        .evidence-panel {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          background: rgba(2, 6, 23, 0.85);
          border: 2px solid #22d3ee;
          border-radius: 14px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(8px);
          padding: 18px;
        }
        .evidence-panel h3 {
          margin: 0 0 10px 0;
          color: #60a5fa;
          text-align: center;
        }
        .frag-list {
          display: grid;
          gap: 10px;
        }
        .frag-item {
          background: rgba(34, 211, 238, 0.1);
          border: 1.5px solid rgba(34, 211, 238, 0.4);
          color: #e5f0ff;
          padding: 10px;
          border-radius: 10px;
          text-align: center;
        }

        .leave-btn {
          position: fixed;
          bottom: 20px;
          left: 20px;
        }

        @media (max-width: 900px) {
          .evidence-panel {
            position: static;
            transform: none;
            width: 100%;
            margin-top: 20px;
          }
          .leave-btn {
            position: static;
            display: inline-block;
            margin-top: 18px;
          }
        }
      `}</style>
    </>
  )
}
