"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const forensicCaseFile = {
  case_name: "Case File: 47-1138 (The Blue Moon Disappearance)",
  exhibits: [
    {
      exhibit_id: "EXH-001",
      item_description: "A single, woman's high-heeled shoe, size 7, with a noticeable scuff mark of dark blue paint on the leather heel.",
      collection_location: "Back alley of the Blue Moon nightclub, near the rear service door.",
      contamination_risk: "HIGH",
      available_analyses: [
        {
          analysis_id: "MAT-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Spectrometric analysis of the scuff mark reveals a custom automotive paint. The specific mixture of cobalt blue pigment and a high-gloss lacquer is a proprietary blend used exclusively by the fleet of luxury cars registered to music producer Vincent Kane. This places one of his vehicles in the alley around the time of the disappearance.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-002",
      item_description: "A gold-plated lipstick tube, brand 'Midnight Kiss,' shade 'Crimson Sin.' The lipstick is partially smudged.",
      collection_location: "Found near a storm drain in the back alley of the Blue Moon nightclub.",
      contamination_risk: "MEDIUM",
      available_analyses: [
        {
          analysis_id: "CHEM-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "The lipstick's chemical profile is a perfect match for samples taken from Velvet Rose's dressing room. However, it is also contaminated with trace amounts of industrial cleaning solvent and a specific brand of cigar ash. The cigar brand is a rare import favored by Police Commissioner Brady, suggesting a possible police cover-up at the scene.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-003",
      item_description: "A cracked 78 RPM vinyl record. The label is custom-printed and reads: 'Velvet Rose - Private Recording'.",
      collection_location: "Discarded in a trash can at the end of the Blue Moon nightclub's back alley.",
      contamination_risk: "MEDIUM",
      available_analyses: [
        {
          analysis_id: "AUD-001",
          analysis_type: "UV_SCANNING",
          results: {
            summary: "UV scanning of the record's label reveals a hidden watermark: an address for a warehouse in the Meatpacking District. While the record is too damaged for traditional playback, our audio forensics lab recovered audio fragments. The recording captures a conversation between Velvet Rose and Vincent Kane discussing blackmail evidence against city officials. Kane is heard threatening Rose, saying '...it's time to clip the songbird's wings permanently.'",
            is_conclusive: true,
          }
        }
      ]
    }
  ]
}

const sceneData = [
  {
    scene_id: "scene_1_intake",
    narration: "A call from the 18th Precinct. Jazz singer 'Velvet Rose' has vanished from the Blue Moon nightclub. The police are calling it a walk-off, but the club owner insists it's foul play. Evidence has been collected from the back alley and sent to the lab for forensic analysis. The city's shadows are long, and the truth is often found in what gets left behind.",
    exhibits: forensicCaseFile.exhibits.map(exhibit => ({
      exhibit_id: exhibit.exhibit_id,
      name: `Exhibit ${exhibit.exhibit_id}: ${exhibit.item_description.split(',')[0]}`,
      description: `Description: ${exhibit.item_description} | Location: ${exhibit.collection_location} | Contamination Risk: ${exhibit.contamination_risk}`,
    })),
    options: forensicCaseFile.exhibits.map(exhibit => ({
      option_id: `opt_analyze_${exhibit.exhibit_id}`,
      description: `Run Forensics on ${exhibit.exhibit_id}`,
      next_scene: `scene_2_results_${exhibit.exhibit_id}`,
    })),
  },
  ...forensicCaseFile.exhibits.flatMap(exhibit => [
    {
      scene_id: `scene_2_results_${exhibit.exhibit_id}`,
      narration: `Forensic analysis of Exhibit ${exhibit.exhibit_id} is complete. The findings from the ${exhibit.available_analyses[0].analysis_type.replace('_', ' ')} are logged in the case file.`,
      analysis: exhibit,
      options: [
        {
          option_id: "opt_return",
          description: "Return to Evidence List",
          next_scene: "scene_1_intake",
        },
        {
          option_id: "opt_conclusion",
          description: "Review Final Report",
          next_scene: "scene_3_conclusion",
        },
      ],
    },
  ]),
  {
    scene_id: "scene_3_conclusion",
    narration: "All forensic analyses are complete. The evidence points not to a simple disappearance, but to a high-level conspiracy. The chemical analysis of the shoe (EXH-001) places Vincent Kane's vehicle at the scene. The lipstick tube (EXH-002) suggests a police cover-up. Most damningly, the damaged record (EXH-003) provides a clear motive—blackmail—and a direct threat from Vincent Kane. The forensic evidence indicates that Velvet Rose's disappearance was orchestrated by Vincent Kane to silence her and protect a powerful corruption ring.",
    options: [
      {
        option_id: "opt_close_case",
        description: "Case Closed - Submit Report to Detective Sullivan",
        next_scene: "case_solved",
      },
    ],
  },
];

export default function NoirNewYorkPage() {
  const [currentScene, setCurrentScene] = useState<string>("scene_1_intake")
  const [discoveredAnalyses, setDiscoveredAnalyses] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1_intake"])
  const router = useRouter()

  useEffect(() => {
    setIsLoading(true);
    new Promise(resolve => setTimeout(resolve, 1000)).then(() => setIsLoading(false));
  }, [])

  const currentSceneData = sceneData.find((scene) => scene.scene_id === currentScene)

  const handleOptionClick = (option: any) => {
    if (currentSceneData?.analysis) {
      setDiscoveredAnalyses(prev => [...new Set([...prev, currentSceneData.analysis.exhibit_id])])
    }
    if (option.next_scene === "case_solved") {
      alert(
        "Forensic Report Submitted. Evidence points to a conspiracy orchestrated by Vincent Kane to silence jazz singer Velvet Rose and conceal a city-wide blackmail operation."
      )
      return
    }
    setSceneHistory((prev) => [...prev, option.next_scene])
    setCurrentScene(option.next_scene)
  }

  const goToPreviousScene = () => {
    if (sceneHistory.length > 1) {
      const newHistory = [...sceneHistory]
      newHistory.pop()
      const previousScene = newHistory[newHistory.length - 1]
      setSceneHistory(newHistory)
      setCurrentScene(previousScene)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Entering the shadows of New York...</p>
        <style jsx>{`
          .loading-screen {
            display: flex; flex-direction: column; justify-content: center;
            align-items: center; height: 100vh;
            background: linear-gradient(135deg, #000000, #1f2937);
            color: #d97706; font-family: "Crimson Text", serif;
          }
          .loading-spinner {
            width: 50px; height: 50px; border: 3px solid rgba(217, 119, 6, 0.3);
            border-top: 3px solid #d97706; border-radius: 50%;
            animation: spin 1s linear infinite; margin-bottom: 20px;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (!currentSceneData) {
    return (
      <div className="error-screen">
        <h2>Scene not found</h2>
        <Link href="/">Return to Cases</Link>
      </div>
    )
  }

  return (
    <>
      <div className="case-container">
        <div className="noir-overlay"></div>
        {sceneHistory.length > 1 && (
          <button className="previous-scene-button" onClick={goToPreviousScene}>
            <span>← Previous Step</span>
          </button>
        )}
        <div className="case-header">
          <h1>Forensic File: The Vanishing of Velvet Rose</h1>
          <div className="status-bar">
            <div className="clues-counter">
              <span className="label">ANALYSES:</span>
              <span className="count">{discoveredAnalyses.length}/{forensicCaseFile.exhibits.length}</span>
            </div>
            <div className="scene-indicator">
              <span className="label">STATUS:</span>
              <span className="scene-id">{currentScene.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="scene-content">
          <div className="narration-box">
            <div className="section-header">
              <span className="icon">🕵️</span>
              <h3>Forensic Summary</h3>
            </div>
            <p className="narration">{currentSceneData.narration}</p>
          </div>

          {currentSceneData.exhibits && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon">🔍</span>
                <h3>Exhibits Logged for Analysis</h3>
              </div>
              {currentSceneData.exhibits.map((exhibit, index) => (
                <div key={index} className="clue-item">
                  <div className="clue-header">
                    <strong className="clue-name">{exhibit.name.toUpperCase()}</strong>
                    <span className="clue-status">PENDING</span>
                  </div>
                  <p className="clue-description">{exhibit.description}</p>
                </div>
              ))}
            </div>
          )}

          {currentSceneData.analysis && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon">🔬</span>
                <h3>Analysis Results: {currentSceneData.analysis.exhibit_id}</h3>
              </div>
              <div className="clue-item">
                <div className="clue-header">
                  <strong className="clue-name">{currentSceneData.analysis.available_analyses[0].analysis_type.replace('_', ' ')}</strong>
                  <span className={`clue-status ${currentSceneData.analysis.available_analyses[0].results.is_conclusive ? 'verified' : 'inconclusive'}`}>
                    {currentSceneData.analysis.available_analyses[0].results.is_conclusive ? "CONCLUSIVE" : "INCONCLUSIVE"}
                  </span>
                </div>
                <p className="clue-description">{currentSceneData.analysis.available_analyses[0].results.summary}</p>
              </div>
            </div>
          )}

          <div className="options-section">
            <div className="section-header">
              <span className="icon">🤔</span>
              <h3>Your Next Action</h3>
            </div>
            <div className="options-grid">
              {currentSceneData.options.map((option, index) => (
                <button key={index} className="option-btn" onClick={() => handleOptionClick(option)}>
                  <span className="option-text">{option.description}</span>
                  <div className="btn-glow"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="back-button" onClick={() => router.back()}>
          ← Return to Cases
        </button>
      </div>
      <style jsx>{`
        .case-container {
          min-height: 100vh; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          color: #e2e8f0; font-family: "Crimson Text", serif; padding: 20px; position: relative; overflow-x: hidden;
        }
        .noir-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at 20% 50%, rgba(0,191,255,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(138,43,226,0.05) 0%, transparent 50%);
          pointer-events: none; animation: noirDrift 25s ease-in-out infinite;
        }
        @keyframes noirDrift { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        .case-header {
          text-align: center; margin-bottom: 30px; padding: 25px;
          background: rgba(0, 191, 255, 0.15); border-radius: 15px; border: 2px solid #00bfff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3); backdrop-filter: blur(10px);
        }
        .case-header h1 { font-size: 2.8rem; margin: 0 0 15px 0; color: #00bfff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .status-bar {
          display: flex; justify-content: center; gap: 40px; font-size: 1.1rem;
        }
        .clues-counter, .scene-indicator {
          display: flex; align-items: center; gap: 8px;
        }
        .label { color: #00ffff; font-weight: bold; }
        .count, .scene-id {
          color: #e2e8f0; background: rgba(0, 191, 255, 0.2);
          padding: 4px 8px; border-radius: 4px;
        }
        .scene-content { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 25px; }
        .narration-box, .clues-section, .options-section {
          background: rgba(26, 26, 46, 0.8); padding: 25px; border-radius: 15px;
          border-left: 5px solid #00bfff; box-shadow: 0 4px 20px rgba(0,0,0,0.2); backdrop-filter: blur(5px);
        }
        .section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid rgba(0, 191, 255, 0.3);
        }
        .section-header .icon { font-size: 1.2rem; }
        .section-header h3 { margin: 0; color: #00bfff; font-size: 1.4rem; }
        .narration { font-size: 1.15rem; line-height: 1.7; font-style: italic; color: #cbd5e0; }
        .clues-section { border-left-color: #00ffff; background: rgba(0, 255, 255, 0.1); }
        .clue-item {
          background: rgba(0, 191, 255, 0.1); padding: 18px; border-radius: 10px;
          margin: 12px 0; border: 1px solid #00ffff;
        }
        .clue-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .clue-name { color: #00bfff; font-size: 1.1rem; }
        .clue-status {
          padding: 2px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;
          background: #00ffff; color: #1a202c;
        }
        .clue-status.verified { background: #00bfff; }
        .clue-status.inconclusive { background: #6c757d; color: #e2e8f0; }
        .clue-description { color: #cbd5e0; margin: 0; line-height: 1.6; }
        .options-grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .option-btn {
          background: linear-gradient(45deg, #00bfff, #8a2be2); color: white; border: none;
          padding: 18px 24px; border-radius: 12px; font-size: 1.05rem; font-weight: 600;
          cursor: pointer; transition: all 0.3s ease; font-family: "Crimson Text", serif;
          position: relative; overflow: hidden;
        }
        .option-btn:hover {
          transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0, 191, 255, 0.4);
          background: linear-gradient(45deg, #00ffff, #9370db);
        }
        .btn-glow {
          position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        .option-btn:hover .btn-glow { left: 100%; }
        .back-button {
          position: fixed; bottom: 25px; left: 25px; background-color: transparent; border: 2px solid #00bfff;
          color: #00bfff; padding: 15px 25px; border-radius: 30px; font-size: 1.05rem; font-weight: 600;
          cursor: pointer; transition: all 0.3s ease;
        }
        .back-button:hover { background-color: #00bfff; color: white; transform: scale(1.05); }
        .previous-scene-button {
          position: fixed; top: 20px; left: 20px; background: transparent;
          border: 2px solid #00ffff; color: #00ffff; padding: 10px 18px; border-radius: 25px;
          font-size: 0.9rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease;
          font-family: "Crimson Text", serif; z-index: 1000;
        }
        .previous-scene-button:hover { background: #00ffff; color: #1a202c; box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
        @media (max-width: 768px) { .options-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
