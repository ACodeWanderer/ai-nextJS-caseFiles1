"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const forensicCaseFile = {
  case_name: "Case File: 1888-ASHWORTH",
  exhibits: [
    {
      exhibit_id: "EXH-001",
      item_description: "A half-empty glass of sherry with a faint, sweet, and slightly bitter aroma not typical of sherry alone.",
      collection_location: "Victim's desk, Ashworth & Associates.",
      contamination_risk: "HIGH",
      available_analyses: [
        {
          analysis_id: "CHEM-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Crude chemical analysis reveals the presence of a significant quantity of laudanum (tincture of opium). The dosage would have been sufficient to induce a state of deep sedation and confusion in the victim, rendering him incapable of defending himself against an attacker.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-002",
      item_description: "A bloody crystal paperweight, used as the murder weapon. The blood is smeared, and there are traces of fabric fibers embedded in a crevice.",
      collection_location: "Found beside the victim's head on his desk.",
      contamination_risk: "MEDIUM",
      available_analyses: [
        {
          analysis_id: "BIO-001",
          analysis_type: "DNA_ANALYSIS",
          results: {
            summary: "Early blood typing confirms the blood is Type A, matching the victim's. Microscopic analysis of the embedded fabric fibers reveals they are fine wool, dyed with a distinctive green aniline dye. This type of fabric and dye is consistent with the material of a lady's walking dress, a popular fashion among the middle and upper classes.",
            is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-003",
      item_description: "A set of mud-stained footprints on the Persian rug leading from the office door towards the desk.",
      collection_location: "Persian rug, victim's office.",
      contamination_risk: "HIGH",
      available_analyses: [
        {
          analysis_id: "TRACE-001",
          analysis_type: "FINGERPRINT_ANALYSIS",
          results: {
            summary: "The footprints were made by a woman's boot, approximately size 5. The mud contains a unique mixture of London clay, coal dust, and traces of a specific type of lavender blossom. This combination is found almost exclusively in the small, private gardens of Bloomsbury Square, where the victim's secretary, Miss Charlotte Pemberton, resides.",
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
    narration: "The gaslights of Threadneedle Street cut weakly through the London fog. Inside the offices of Ashworth & Associates, prominent banker Reginald Ashworth is dead. The initial report from Inspector Blackthorne suggests a violent confrontation. The forensic examination must cut through the city's grime and the secrets of high society to find the truth. The evidence awaits your analysis.",
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
    narration: "All forensic analyses are complete. The evidence paints a clear picture of a premeditated and intimate murder. The chemical analysis of the sherry (EXH-001) proves the victim was drugged and incapacitated. The fabric fibers on the murder weapon (EXH-002) point to a female assailant. Most conclusively, the unique soil composition in the footprints (EXH-003) places the victim's secretary, Miss Charlotte Pemberton, at the scene of the crime. The combined forensic evidence indicates that Miss Pemberton drugged her employer and then, in a crime of passion or calculation, killed him.",
    options: [
      {
        option_id: "opt_close_case",
        description: "Case Closed - Submit Report to Inspector Blackthorne",
        next_scene: "case_solved",
      },
    ],
  },
];

export default function VictorianBankerCase() {
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
        "Forensic Report Submitted. Evidence indicates Charlotte Pemberton drugged Reginald Ashworth with laudanum before striking the fatal blow. Trace evidence from her boots links her directly to the crime scene."
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
        <p>Entering the London fog...</p>
        <style jsx>{`
          .loading-screen {
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            height: 100vh; background: #2c2c3e; color: #d4af37; font-family: "serif";
          }
          .loading-spinner {
            width: 50px; height: 50px; border: 3px solid rgba(212, 175, 55, 0.3);
            border-top: 3px solid #d4af37; border-radius: 50%;
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
        <h2>File Not Found</h2>
        <Link href="/">Return to Scotland Yard</Link>
      </div>
    );
  }

  return (
    <>
      <div className="case-container">
        <div className="victorian-overlay"></div>
        {sceneHistory.length > 1 && (
          <button className="previous-scene-button" onClick={goToPreviousScene}>
            <span>← Previous Step</span>
          </button>
        )}
        <div className="case-header">
          <h1>Forensics: The Threadneedle Street Murder</h1>
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
          background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 50%, #701a75 100%);
          color: #f3e8ff;
          font-family: "serif";
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }
        .victorian-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: radial-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 1px);
          background-size: 5px 5px;
          opacity: 0.3;
          pointer-events: none;
          z-index: -1;
        }
        .case-header {
          text-align: center; margin-bottom: 30px; padding: 25px;
          background: rgba(168, 85, 247, 0.1);
          border-radius: 10px; border: 2px solid #a855f7;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          font-size: 2.5rem; margin: 0 0 15px 0; color: #f3e8ff;
          text-shadow: 0 0 15px rgba(243, 232, 255, 0.8);
          letter-spacing: 2px;
        }
        .status-bar {
          display: flex; justify-content: center; gap: 40px; font-size: 1.1rem;
        }
        .clues-counter, .scene-indicator {
          display: flex; align-items: center; gap: 8px;
        }
        .label { color: #c084fc; font-weight: bold; }
        .count, .scene-id {
          color: #f3e8ff; background: rgba(168, 85, 247, 0.2);
          padding: 4px 8px; border-radius: 4px;
        }
        .scene-content {
          max-width: 900px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 25px;
        }
        .narration-box, .dialogue-section, .clues-section, .options-section {
          background: rgba(0, 0, 0, 0.3); padding: 25px; border-radius: 10px;
          border: 1px solid #a855f7;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.2);
          backdrop-filter: blur(5px);
        }
        .section-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px; padding-bottom: 10px;
          border-bottom: 1px solid rgba(168, 85, 247, 0.3);
        }
        .section-header h3 {
          margin: 0; color: #c084fc; font-size: 1.2rem; letter-spacing: 1px;
        }
        .narration {
          font-size: 1.1rem; line-height: 1.7; color: #e9d5ff; font-style: italic;
        }
        .clues-section { border-color: #d8b4fe; }
        .clue-item {
          background: rgba(216, 180, 254, 0.1); padding: 18px;
          border-radius: 8px; margin: 15px 0; border: 1px solid #d8b4fe;
        }
        .clue-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .clue-name { color: #d8b4fe; font-size: 1.1rem; }
        .clue-status {
          padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; font-weight: bold;
          background: #d8b4fe; color: #000;
        }
        .clue-status.verified { background: #c084fc; }
        .clue-status.inconclusive { background: #6b7280; color: #fff; }
        .clue-description { color: #e9d5ff; margin: 0; line-height: 1.5; }
        .options-grid {
          display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .option-btn {
          background: linear-gradient(45deg, #a855f7, #c084fc);
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
          border: 2px solid #a855f7; color: #a855f7;
          padding: 12px 20px; border-radius: 25px; font-size: 1rem; font-weight: bold;
          cursor: pointer; transition: all 0.3s ease; font-family: "serif";
        }
        .back-button:hover {
          background: #a855f7; color: #6b21a8;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); transform: scale(1.05);
        }
        .previous-scene-button {
          position: fixed; top: 20px; left: 20px; background: transparent;
          border: 2px solid #c084fc; color: #c084fc;
          padding: 10px 18px; border-radius: 25px; font-size: 0.9rem; font-weight: bold;
          cursor: pointer; transition: all 0.3s ease; font-family: "serif"; z-index: 1000;
        }
        .previous-scene-button:hover {
          background: #c084fc; color: #6b21a8;
          box-shadow: 0 0 20px rgba(192, 132, 252, 0.5); transform: scale(1.05);
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
