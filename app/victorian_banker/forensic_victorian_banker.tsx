"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
  const [currentScene, setCurrentScene] = useState("scene_1_intake")
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
  
  const handleBackToScene = () => {
    if (sceneHistory.length > 1) {
      const newHistory = sceneHistory.slice(0, -1)
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
                height: 100vh; background: #2c2c3e; color: #d4af37;
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

  const scene = currentSceneData;
  if (!scene) return <div>Scene not found</div>;
  
  return (
    <div className="case-container">
      <div className="scene-content">
        {sceneHistory.length > 1 && (
            <button className="previous-scene-button" onClick={handleBackToScene}>
                ← Previous Step
            </button>
        )}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-2 text-violet-100 drop-shadow-lg">
            Forensics: The Threadneedle Street Murder
          </h1>
        </div>
        
        <div className="narration-box">
          <h2 className="text-3xl font-serif font-semibold mb-4 text-violet-200">
            Forensic Summary
          </h2>
          <p className="text-purple-100 leading-relaxed font-serif text-xl">{scene.narration}</p>
        </div>

        {scene.exhibits && (
            <div className="options-section">
                <h3 className="text-xl font-serif text-violet-200 mb-4">Evidence for Analysis:</h3>
                <div className="grid gap-3">
                    {scene.exhibits.map((exhibit, index) => (
                        <div key={index} className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/30">
                            <h4 className="font-serif font-semibold text-violet-200 text-lg">{exhibit.name}</h4>
                            <p className="text-purple-200 text-base mt-1">{exhibit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {scene.analysis && (
            <div className="narration-box">
                <h2 className="text-3xl font-serif font-semibold mb-4 text-violet-200">
                    Analysis Results: {scene.analysis.exhibit_id}
                </h2>
                <div className="bg-purple-800/50 p-3 rounded-lg border-l-4 border-violet-400/50">
                    <p className="text-purple-100 font-serif italic text-lg">
                        <strong>{scene.analysis.available_analyses[0].analysis_type.replace('_', ' ')}:</strong> "{scene.analysis.available_analyses[0].results.summary}"
                    </p>
                </div>
            </div>
        )}

        <div className="options-section">
            <h3 className="text-xl font-serif text-violet-200 mb-4">Forensic Actions:</h3>
            <div className="options-grid">
                {scene.options.map((option) => (
                    <button
                        key={option.option_id}
                        className="option-btn"
                        onClick={() => handleOptionClick(option)}
                    >
                        <span className="option-text">{option.description}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <button className="back-button" onClick={() => router.back()}>
        <span>← RETURN TO CASES</span>
      </button>

      <style jsx>{`
        .case-container {
          min-height: 100vh; background: linear-gradient(135deg, #6b21a8 0%, #7e22ce 50%, #701a75 100%);
          color: white; padding: 20px;
        }
        .scene-content { max-width: 750px; margin: 0 auto; display: flex; flex-direction: column; gap: 25px; }
        .narration-box, .options-section {
            background: rgba(123, 44, 191, 0.8); padding: 25px; border-radius: 10px;
            border: 1px solid rgba(147, 51, 234, 0.6); box-shadow: 0 0 25px rgba(147, 51, 234, 0.4);
            backdrop-filter: blur(8px);
        }
        .options-grid { display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .option-btn {
            background: linear-gradient(45deg, #a855f7, #c084fc); color: #000; border: none;
            padding: 20px 28px; border-radius: 8px; font-size: 1rem; font-weight: bold;
            cursor: pointer; transition: all 0.3s ease; font-family: serif;
        }
        .option-btn:hover {
            transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 30px rgba(168, 85, 247, 0.5);
            background: linear-gradient(45deg, #c084fc, #ddd6fe);
        }
        .back-button, .previous-scene-button {
            position: fixed; background: transparent; border: 2px solid #a855f7; color: #a855f7;
            padding: 15px 25px; border-radius: 25px; font-size: 1rem; font-weight: bold;
            cursor: pointer; transition: all 0.3s ease; font-family: serif;
        }
        .back-button { bottom: 20px; left: 20px; }
        .previous-scene-button { top: 20px; left: 20px; }
        .back-button:hover, .previous-scene-button:hover {
            background: #a855f7; color: #6b21a8; box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  )
}
