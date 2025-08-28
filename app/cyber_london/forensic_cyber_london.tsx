"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const forensicCaseFile = {
  case_name: "Case File: 7-NEXUS-TOWER",
  exhibits: [
    {
      exhibit_id: "EXH-001",
      item_description: "A company-issued laptop, recovered from the victim's desk. The screen is active, showing a half-written email.",
      collection_location: "Executive Office, 40th Floor, Nexus Tower.",
      contamination_risk: "LOW",
      available_analyses: [
        {
          analysis_id: "DF-001",
          analysis_type: "FINGERPRINT_ANALYSIS",
          results: {
            summary: "Fingerprints from the victim, Marcus Blackwell, are prevalent. However, a clear print belonging to his assistant, Lisa Wong, was found on the 'delete' key. The computer's system logs, timestamped after the victim's death, show an attempt to permanently erase several financial files. Digital recovery of these files revealed an email draft detailing a £2.3 million embezzlement scheme traced to Lisa Wong.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-002",
      item_description: "A network-enabled 'Ember' smart coffee mug, half-full with a cold, dark liquid.",
      collection_location: "Victim's desk, inches from the keyboard.",
      contamination_risk: "MEDIUM",
      available_analyses: [
        {
          analysis_id: "LOG-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Mass spectrometry confirms the liquid contains a lethal dose of Ricin. The mug's internal data-log, synced to the company's network, shows its final heating cycle was initiated at 2:14 PM. This action was authenticated via a security fob registered to Lisa Wong, placing her in control of the murder weapon minutes before the security camera blackout.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-003",
      item_description: "A crystalline residue sample collected from a spill between the keys of the victim's keyboard.",
      collection_location: "Victim's keyboard, Executive Office.",
      contamination_risk: "HIGH",
      available_analyses: [
        {
          analysis_id: "RES-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "The residue is crystallized coffee laced with Ricin, matching the contents of the smart mug (EXH-002). The sample also contains traces of a unique polymer used in a specific brand of hand lotion. Purchase records confirm Lisa Wong bought a bottle of this lotion last week.",
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
    narration: "A priority call from the Nexus Tower in Canary Wharf. Tech CEO Marcus Blackwell is dead in his office from a suspected poisoning. The digital forensics unit is being called in to process the scene. All exhibits are digital or have a digital component. The potential for remote data tampering is high. Your analysis must be fast and precise.",
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
      narration: `Forensic analysis of Exhibit ${exhibit.exhibit_id} is complete. The findings from the ${exhibit.available_analyses[0].analysis_type.replace('_', ' ')} are logged in the system.`,
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
    narration: "All forensic analyses are complete. The evidence creates an undeniable digital and physical trail leading to one suspect. The chemical analysis of the smart mug (EXH-002) and keyboard residue (EXH-003) proves murder by poison and links Lisa Wong to the weapon through data logs and trace evidence. The analysis of the laptop (EXH-001) provides a clear motive—embezzlement—and shows her attempts to cover her tracks after the murder. The combined forensic data indicates with certainty that Lisa Wong acted alone to poison her employer.",
    options: [
      {
        option_id: "opt_close_case",
        description: "Case Closed - Transmit Warrant to Detective Chen",
        next_scene: "case_solved",
      },
    ],
  },
];

export default function CyberLondonPage() {
  const [currentScene, setCurrentScene] = useState("scene_1_intake")
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
        "Forensic Report Transmitted. Data confirms Lisa Wong poisoned Marcus Blackwell to conceal embezzlement, then attempted to erase digital evidence."
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
        <p>Initializing cyber investigation...</p>
        <div className="matrix-bg"></div>
        <style jsx>{`
          .loading-screen {
            display: flex; flex-direction: column; justify-content: center;
            align-items: center; height: 100vh;
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e);
            color: #00ff41; font-family: "Courier New", monospace;
            position: relative; overflow: hidden;
          }
          .loading-spinner {
            width: 60px; height: 60px; border: 3px solid rgba(0, 255, 65, 0.3);
            border-top: 3px solid #00ff41; border-radius: 50%;
            animation: spin 1s linear infinite; margin-bottom: 20px;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
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
    )
  }
  
  return (
    <>
      <div className="case-container">
        <div className="matrix-overlay"></div>
        {sceneHistory.length > 1 && (
          <button className="previous-scene-button" onClick={goToPreviousScene}>
            <span>← Previous Step</span>
          </button>
        )}
        <div className="case-header">
          <h1>Digital Forensics: The Silicon Murder</h1>
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
              <span className="icon"> 📍 </span>
              <h3>FORENSIC OVERVIEW</h3>
            </div>
            <p className="narration">{currentSceneData.narration}</p>
          </div>

          {currentSceneData.exhibits && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon"> 🔍 </span>
                <h3>EVIDENCE QUEUE</h3>
              </div>
              {currentSceneData.exhibits.map((exhibit, index) => (
                <div key={index} className="clue-item">
                  <div className="clue-header">
                    <strong className="clue-name">{exhibit.name}</strong>
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
              <span className="icon"> ⚡ </span>
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
          <span>← DISCONNECT</span>
        </button>
      </div>
      <style jsx>{`
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e);
          color: #00ff41; font-family: "Courier New", monospace;
          padding: 20px; position: relative; overflow-x: hidden;
        }
        .matrix-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image:
            linear-gradient(90deg, transparent 98%, rgba(0, 255, 65, 0.05) 100%),
            linear-gradient(0deg, transparent 98%, rgba(0, 255, 65, 0.05) 100%);
          background-size: 30px 30px; animation: matrix-scroll 4s linear infinite;
          pointer-events: none; z-index: -1;
        }
        @keyframes matrix-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        .case-header {
          text-align: center; margin-bottom: 30px; padding: 25px;
          background: rgba(0, 255, 65, 0.1); border-radius: 10px;
          border: 2px solid #00ff41; box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          font-size: 2.5rem; margin: 0 0 15px 0; color: #00ff41;
          text-shadow: 0 0 15px rgba(0, 255, 65, 0.8); letter-spacing: 2px;
        }
        .status-bar { display: flex; justify-content: center; gap: 40px; font-size: 1.1rem; }
        .clues-counter, .scene-indicator { display: flex; align-items: center; gap: 8px; }
        .label { color: #0ff; font-weight: bold; }
        .count, .scene-id {
          color: #00ff41; background: rgba(0, 255, 65, 0.2);
          padding: 4px 8px; border-radius: 4px;
        }
        .scene-content { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 25px; }
        .narration-box, .dialogue-section, .clues-section, .options-section {
          background: rgba(0, 0, 0, 0.7); padding: 25px; border-radius: 10px;
          border: 1px solid #00ff41; box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
          backdrop-filter: blur(5px);
        }
        .section-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
          padding-bottom: 10px; border-bottom: 1px solid rgba(0, 255, 65, 0.3);
        }
        .section-header h3 { margin: 0; color: #0ff; font-size: 1.2rem; letter-spacing: 1px; }
        .narration { font-size: 1.1rem; line-height: 1.7; color: #e0e0e0; font-style: italic; }
        .clues-section { border-color: #ffd700; }
        .clue-item {
          background: rgba(255, 215, 0, 0.1); padding: 18px; border-radius: 8px;
          margin: 15px 0; border: 1px solid #ffd700;
        }
        .clue-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .clue-name { color: #ffd700; font-size: 1.1rem; }
        .clue-status {
            padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;
            font-weight: bold; background: #ffd700; color: #000;
        }
        .clue-status.verified { background: #00ff41; }
        .clue-status.inconclusive { background: #666; color: #fff; }
        .clue-description { color: #e0e0e0; margin: 0; line-height: 1.5; }
        .options-grid { display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .option-btn {
          background: linear-gradient(45deg, #00ff41, #0ff); color: #000; border: none;
          padding: 18px 25px; border-radius: 8px; font-size: 1rem; font-weight: bold;
          cursor: pointer; transition: all 0.3s ease; position: relative;
          font-family: "Courier New", monospace; overflow: hidden;
        }
        .option-btn:hover {
          transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0, 255, 65, 0.4);
        }
        .btn-glow {
          position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        .option-btn:hover .btn-glow { left: 100%; }
        .back-button {
          position: fixed; bottom: 20px; left: 20px; background: transparent;
          border: 2px solid #00ff41; color: #00ff41; padding: 12px 20px;
          border-radius: 25px; font-size: 1rem; font-weight: bold; cursor: pointer;
          transition: all 0.3s ease; font-family: "Courier New", monospace;
        }
        .back-button:hover {
          background: #00ff41; color: #000; box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
          transform: scale(1.05);
        }
        .previous-scene-button {
          position: fixed; top: 20px; left: 20px; background: transparent;
          border: 2px solid #0ff; color: #0ff; padding: 10px 18px;
          border-radius: 25px; font-size: 0.9rem; font-weight: bold; cursor: pointer;
          transition: all 0.3s ease; font-family: "Courier New", monospace; z-index: 1000;
        }
        .previous-scene-button:hover {
          background: #0ff; color: #000; box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
          transform: scale(1.05);
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
