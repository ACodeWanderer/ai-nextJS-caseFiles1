"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const forensicCaseFile = {
  case_name: "Case File: 10-23-HARTWELL",
  exhibits: [
    {
      exhibit_id: "EXH-001",
      item_description: "An overturned teacup and an open, prescribed bottle of heart medication (Digitoxin). The victim was known to be taking this medication.",
      collection_location: "Professor Hartwell's writing desk, Whitmore University.",
      contamination_risk: "MEDIUM",
      available_analyses: [
        {
          analysis_id: "TOX-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Toxicology confirms the tea contains a low, typically non-lethal dose of cyanide. However, the victim's prescription medication, Digitoxin, was also present. The combination of cyanide with this specific cardiac medication is known to trigger a fatal arrhythmia. This indicates the cause of death was a sophisticated poisoning that exploited a known medical vulnerability.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-002",
      item_description: "A half-finished, handwritten letter on university letterhead. The script shows significant tremor and degradation in the final lines.",
      collection_location: "Found under the victim's hand on the writing desk.",
      contamination_risk: "LOW",
      available_analyses: [
        {
          analysis_id: "DOC-001",
          analysis_type: "FINGERPRINT_ANALYSIS",
          results: {
            summary: "The victim's prints are on the pen and top of the paper. A second set of prints, identified as belonging to Dean Margaret Ashford, were found on the paper's edges, consistent with someone holding it down. Document analysis indicates the erratic handwriting in the final lines is consistent with writing under extreme duress or physical restraint.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-003",
      item_description: "The victim's personal desktop computer, found powered on and logged into the user's account.",
      collection_location: "Professor Hartwell's writing desk.",
      contamination_risk: "LOW",
      available_analyses: [
        {
          analysis_id: "COMP-001",
          analysis_type: "UV_SCANNING",
          results: {
            summary: "UV scanning of the keyboard showed no unusual traces. However, a timeline reconstruction from the computer's activity logs was performed. The logs show that at 7:47 PM, the victim accessed encrypted files related to an unauthorized research study named 'Project Free Will'. Web history from the preceding hour shows searches for 'cyanide toxicity' and 'effects of poison on cardiac patients'. The final logged activity was the opening of a text document at 7:55 PM, seconds before the university's network logged an administrative door override used by Dean Ashford.",
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
    narration: "A call from Whitmore University. Professor Edmund Hartwell, head of Philosophy, has been found dead in his study in a classic locked-room scenario. The initial report is ambiguous, with possibilities ranging from suicide to a cleverly disguised murder. The forensic unit has been tasked with analyzing the evidence to determine the truth behind the professor's final lesson.",
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
    narration: "All forensic analyses are complete. The evidence does not point to murder, but to a complex and tragic suicide. The computer logs (EXH-003) establish the victim's motive—guilt over unethical research—and show he researched the specific method of his death. The toxicology report (EXH-001) confirms this unique method was used. Crucially, the fingerprint and document analysis of the letter (EXH-002) physically places Dean Margaret Ashford at the scene during the event, assisting or attempting to intervene. The evidence strongly suggests the professor took his own life, and the dean was involved in the immediate aftermath, likely obstructing justice to mitigate a university scandal.",
    options: [
      {
        option_id: "opt_close_case",
        description: "Case Closed - Submit Report to DI Morrison",
        next_scene: "case_solved",
      },
    ],
  },
];

export default function ProfessorStudyCase() {
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
        "Forensic Report Submitted. Evidence indicates Professor Hartwell died by suicide, exploiting his own medical condition. Dean Margaret Ashford was present and subsequently tampered with the scene, warranting charges of assisted suicide and obstruction of justice."
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
        <p>Accessing university archives...</p>
        <style jsx>{`
          .loading-screen {
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            height: 100vh; background: linear-gradient(135deg, #7c2d92 0%, #a855f7 50%, #6b21a8 100%);
            color: #fef3c7; font-family: "serif";
          }
          .loading-spinner {
            width: 50px; height: 50px; border: 3px solid rgba(254, 243, 199, 0.3);
            border-top: 3px solid #fef3c7; border-radius: 50%;
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
        <h2>Archive Not Found</h2>
        <Link href="/">Return to Case Files</Link>
      </div>
    );
  }

  return (
    <>
      <div className="case-container">
        <div className="study-overlay"></div>
        {sceneHistory.length > 1 && (
          <button className="previous-scene-button" onClick={goToPreviousScene}>
            <span>← Previous Step</span>
          </button>
        )}
        <div className="case-header">
          <h1>Forensics: The Professor's Study</h1>
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
          background: linear-gradient(135deg, #7c2d92 0%, #a855f7 50%, #6b21a8 100%);
          color: #fef3c7;
          font-family: "serif";
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }
        .study-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: linear-gradient(90deg, transparent 98%, rgba(254, 243, 199, 0.05) 100%),
                            linear-gradient(0deg, transparent 98%, rgba(254, 243, 199, 0.05) 100%);
          background-size: 30px 30px;
          pointer-events: none;
          z-index: -1;
        }
        .case-header {
          text-align: center; margin-bottom: 30px; padding: 25px;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 10px; border: 2px solid #fbbf24;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          font-size: 2.5rem; margin: 0 0 15px 0; color: #fef3c7;
          text-shadow: 0 0 15px rgba(254, 243, 199, 0.8);
          letter-spacing: 2px;
        }
        .status-bar {
          display: flex; justify-content: center; gap: 40px; font-size: 1.1rem;
        }
        .clues-counter, .scene-indicator {
          display: flex; align-items: center; gap: 8px;
        }
        .label { color: #d8b4fe; font-weight: bold; }
        .count, .scene-id {
          color: #fef3c7; background: rgba(251, 191, 36, 0.2);
          padding: 4px 8px; border-radius: 4px;
        }
        .scene-content {
          max-width: 900px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 25px;
        }
        .narration-box, .dialogue-section, .clues-section, .options-section {
          background: rgba(0, 0, 0, 0.3); padding: 25px; border-radius: 10px;
          border: 1px solid #fbbf24;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
          backdrop-filter: blur(5px);
        }
        .section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; padding-bottom: 10px;
          border-bottom: 1px solid rgba(251, 191, 36, 0.3);
        }
        .section-header h3 {
          margin: 0; color: #d8b4fe; font-size: 1.2rem; letter-spacing: 1px;
        }
        .narration {
          font-size: 1.1rem; line-height: 1.7; color: #f3e8ff; font-style: italic;
        }
        .clues-section { border-color: #fbbf24; }
        .clue-item {
          background: rgba(251, 191, 36, 0.1); padding: 18px;
          border-radius: 8px; margin: 15px 0; border: 1px solid #fbbf24;
        }
        .clue-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .clue-name { color: #fbbf24; font-size: 1.1rem; }
        .clue-status {
          padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: bold;
          background: #fbbf24; color: #000;
        }
        .clue-status.verified { background: #d8b4fe; }
        .clue-status.inconclusive { background: #9ca3af; color: #fff; }
        .clue-description { color: #f3e8ff; margin: 0; line-height: 1.5; }
        .options-grid {
          display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .option-btn {
          background: linear-gradient(45deg, #a855f7, #fbbf24);
          color: #000; border: none; padding: 18px 25px; border-radius: 8px;
          font-size: 1rem; font-weight: bold; cursor: pointer;
          transition: all 0.3s ease; position: relative;
          font-family: "serif"; overflow: hidden;
        }
        .option-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
        }
        .btn-glow {
          position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .option-btn:hover .btn-glow { left: 100%; }
        .back-button {
          position: fixed; bottom: 20px; left: 20px; background: transparent;
          border: 2px solid #fbbf24; color: #fbbf24;
          padding: 12px 20px; border-radius: 25px; font-size: 1rem; font-weight: bold;
          cursor: pointer; transition: all 0.3s ease; font-family: "serif";
        }
        .back-button:hover {
          background: #fbbf24; color: #6b21a8;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); transform: scale(1.05);
        }
        .previous-scene-button {
          position: fixed; top: 20px; left: 20px; background: transparent;
          border: 2px solid #d8b4fe; color: #d8b4fe;
          padding: 10px 18px; border-radius: 25px; font-size: 0.9rem; font-weight: bold;
          cursor: pointer; transition: all 0.3s ease; font-family: "serif"; z-index: 1000;
        }
        .previous-scene-button:hover {
          background: #d8b4fe; color: #6b21a8;
          box-shadow: 0 0 20px rgba(216, 180, 254, 0.5); transform: scale(1.05);
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
