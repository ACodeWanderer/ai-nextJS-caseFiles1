"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const forensicCaseFile = {
  case_name: "Case File: 11-23-PINE-RIDGE",
  exhibits: [
    {
      exhibit_id: "EXH-001",
      item_description: "A heavy, wrought-iron fireplace poker with a noticeable bend in the shaft and a small, dark red stain on the tip.",
      collection_location: "Lying on the hearth of the study's fireplace.",
      contamination_risk: "MEDIUM",
      available_analyses: [
        {
          analysis_id: "MET-001",
          analysis_type: "DNA_ANALYSIS",
          results: {
            summary: "DNA analysis of the blood stain on the poker tip confirms a perfect match to the victim, Jonathan Blackwood. Metallurgical analysis of the bent shaft shows stress fractures consistent with a single, forceful impact against a dense object, such as a human skull. This is conclusively the murder weapon.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-002",
      item_description: "A blood sample collected from the victim during the preliminary examination.",
      collection_location: "From the victim, Jonathan Blackwood.",
      contamination_risk: "LOW",
      available_analyses: [
        {
          analysis_id: "TOX-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Toxicology reports show a lethal concentration of potassium cyanide in the victim's bloodstream. The poison was ingested orally approximately 30-45 minutes before the blunt force trauma to the head, which was the ultimate cause of death. This indicates a two-stage, premeditated murder.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-003",
      item_description: "A sample of water collected from a small puddle of melted snow on the stone hearth of the fireplace.",
      collection_location: "Hearth of the study fireplace, Pine Ridge Lodge.",
      contamination_risk: "HIGH",
      available_analyses: [
        {
          analysis_id: "HYD-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Isotopic and mineral analysis of the water sample reveals its origin is not from the local mountain snowfall. The water contains trace amounts of specific minerals and a unique saline concentration found only in the de-icing salt used in the lodge's main entryway. Furthermore, the water contains microscopic traces of a chemical reagent used in photography development kits, a direct link to the darkroom chemicals used by Dr. Chen.",
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
    narration: "A priority call from the isolated Pine Ridge Lodge. Renowned architect Jonathan Blackwood has been found dead in his study, which was locked from the inside. A blizzard has cut off all communication and travel, trapping the killer and guests inside. The local marshal has secured the scene and collected preliminary evidence for your forensic analysis. The clock is ticking before the storm clears.",
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
    narration: "All forensic analyses are complete. The evidence points to a meticulously planned murder. The toxicology report (EXH-002) shows the victim was first poisoned with cyanide. The DNA and metallurgical analysis of the poker (EXH-001) confirm it as the weapon used to deliver the final blow. Most critically, the water analysis of the melted snow (EXH-003) proves the killer was present in the room, bringing in snow from the lodge's entryway that contained traces of darkroom chemicals. This provides a direct, multi-layered forensic link to Dr. Chen, who had access to both cyanide and the specific chemicals found. The evidence indicates she poisoned the victim, then staged the scene to look like a simple assault.",
    options: [
      {
        option_id: "opt_close_case",
        description: "Case Closed - Submit Report to Detective Hayes",
        next_scene: "case_solved",
      },
    ],
  },
];

export default function SnowyLodgePage() {
  const router = useRouter()
  const [currentScene, setCurrentScene] = useState<string>("scene_1_intake")
  const [discoveredAnalyses, setDiscoveredAnalyses] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1_intake"])

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
        "Forensic Report Submitted. Evidence indicates Dr. Chen poisoned Jonathan Blackwood and then staged the scene, using the fireplace poker as a secondary weapon. Trace evidence from melted snow conclusively links her to the crime scene."
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
        <p>Analyzing samples from the storm...</p>
        <style jsx>{`
          .loading-screen {
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            height: 100vh; background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #312e81 100%);
            color: #f1f5f9; font-family: "Inter", sans-serif;
          }
          .loading-spinner {
            width: 50px; height: 50px; border: 3px solid rgba(241, 245, 249, 0.3);
            border-top: 3px solid #f1f5f9; border-radius: 50%;
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
        <h2>Connection Lost</h2>
        <Link href="/">Return to Detective Hub</Link>
      </div>
    );
  }

  return (
    <>
      <div className="case-container">
        <div className="snow-overlay">
          {[...Array(20)].map((_, i) => (<div key={i} className={`snowflake snowflake-${i + 1}`}>❄</div>))}
        </div>
        {sceneHistory.length > 1 && (
          <button className="previous-scene-button" onClick={goToPreviousScene}>
            <span>← Previous Step</span>
          </button>
        )}
        <div className="case-header">
          <h1>Forensics: The Pine Ridge Lodge Mystery</h1>
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
              <span className="icon">📍</span>
              <h3>FORENSIC OVERVIEW</h3>
            </div>
            <p className="narration">{currentSceneData.narration}</p>
          </div>

          {currentSceneData.exhibits && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon">🔍</span>
                <h3>EVIDENCE QUEUE</h3>
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
                <h3>ANALYSIS RESULTS: {currentSceneData.analysis.exhibit_id}</h3>
              </div>
              <div className="clue-item">
                <div className="clue-header">
                  <strong className="clue-name">{currentSceneData.analysis.available_analyses[0].analysis_type.replace("_", " ")}</strong>
                  <span className={`clue-status ${currentSceneData.analysis.available_analyses[0].results.is_conclusive ? "verified" : "inconclusive"}`}>
                    {currentSceneData.analysis.available_analyses[0].results.is_conclusive ? "CONCLUSIVE" : "INCONCLUSIVE"}
                  </span>
                </div>
                <p className="clue-description">{currentSceneData.analysis.available_analyses[0].results.summary}</p>
              </div>
            </div>
          )}

          <div className="options-section">
            <div className="section-header">
              <span className="icon">⚡</span>
              <h3>NEXT ACTION</h3>
            </div>
            <div className="options-grid">
              {currentSceneData.options.map((option, index) => (
                <button
                  key={index}
                  className="option-btn"
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="option-text">{option.description}</span>
                  <div className="btn-glow"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <button className="back-button" onClick={() => router.back()}>
          <span>← RETURN TO CASES</span>
        </button>
      </div>
      <style jsx>{`
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #312e81 100%);
          color: #f1f5f9;
          font-family: "Inter", sans-serif;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }
        .snow-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: -1; }
        .snowflake { position: absolute; top: -5%; color: white; user-select: none; animation: snowfall linear infinite; }
        @keyframes snowfall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
        ${[...Array(20)].map((_, i) => `
          .snowflake-${i+1} {
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 12 + 8}px;
            animation-duration: ${Math.random() * 5 + 5}s;
            animation-delay: ${Math.random() * 5}s;
          }
        `).join('')}
        .case-header {
          text-align: center; margin-bottom: 30px; padding: 25px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px; border: 2px solid #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          font-size: 2.5rem; margin: 0 0 15px 0; color: #dbeafe;
          text-shadow: 0 0 15px rgba(219, 234, 254, 0.8);
          letter-spacing: 2px;
        }
        .status-bar {
          display: flex; justify-content: center; gap: 40px; font-size: 1.1rem;
        }
        .clues-counter, .scene-indicator {
          display: flex; align-items: center; gap: 8px;
        }
        .label { color: #93c5fd; font-weight: bold; }
        .count, .scene-id {
          color: #dbeafe; background: rgba(59, 130, 246, 0.2);
          padding: 4px 8px; border-radius: 4px;
        }
        .scene-content {
          max-width: 900px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 25px;
        }
        .narration-box, .dialogue-section, .clues-section, .options-section {
          background: rgba(30, 41, 59, 0.7); padding: 25px; border-radius: 10px;
          border: 1px solid #3b82f6;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(5px);
        }
        .section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; padding-bottom: 10px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.3);
        }
        .section-header h3 {
          margin: 0; color: #93c5fd; font-size: 1.2rem; letter-spacing: 1px;
        }
        .narration {
          font-size: 1.1rem; line-height: 1.7; color: #e2e8f0; font-style: italic;
        }
        .clues-section { border-color: #3b82f6; }
        .clue-item {
          background: rgba(59, 130, 246, 0.1); padding: 18px;
          border-radius: 8px; margin: 15px 0; border: 1px solid #3b82f6;
        }
        .clue-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .clue-name { color: #93c5fd; font-size: 1.1rem; }
        .clue-status {
          padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: bold;
          background: #93c5fd; color: #000;
        }
        .clue-status.verified { background: #dbeafe; }
        .clue-status.inconclusive { background: #64748b; color: #fff; }
        .clue-description { color: #e2e8f0; margin: 0; line-height: 1.5; }
        .options-grid {
          display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .option-btn {
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          color: #fff; border: none; padding: 18px 25px; border-radius: 8px;
          font-size: 1rem; font-weight: bold; cursor: pointer;
          transition: all 0.3s ease; position: relative;
          font-family: "Inter", sans-serif; overflow: hidden;
        }
        .option-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }
        .btn-glow {
          position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .option-btn:hover .btn-glow { left: 100%; }
        .back-button {
          position: fixed; bottom: 20px; left: 20px; background: transparent;
          border: 2px solid #3b82f6; color: #dbeafe;
          padding: 12px 20px; border-radius: 25px; font-size: 1rem; font-weight: bold;
          cursor: pointer; transition: all 0.3s ease; font-family: "Inter", sans-serif;
        }
        .back-button:hover {
          background: #3b82f6; color: #000;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); transform: scale(1.05);
        }
        .previous-scene-button {
          position: fixed; top: 20px; left: 20px; background: transparent;
          border: 2px solid #93c5fd; color: #93c5fd;
          padding: 10px 18px; border-radius: 25px; font-size: 0.9rem; font-weight: bold;
          cursor: pointer; transition: all 0.3s ease; font-family: "Inter", sans-serif; z-index: 1000;
        }
        .previous-scene-button:hover {
          background: #93c5fd; color: #000;
          box-shadow: 0 0 20px rgba(147, 197, 253, 0.5); transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .case-header h1 { font-size: 2rem; }
          .status-bar { flex-direction: column; gap: 15px; }
          .options-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
