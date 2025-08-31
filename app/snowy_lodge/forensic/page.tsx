"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ArrowLeft, Snowflake, Mountain } from "lucide-react"

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
        "Forensic Report Submitted. Evidence indicates Dr. Chen poisoned Jonathan Blackwood and then staged the scene, using the fireplace poker as a secondary weapon. Trace evidence from melted snow conclusively links her to the crime scene."
      )
      return
    }
    setSceneHistory((prev) => [...prev, option.next_scene])
    setCurrentScene(option.next_scene)
  }
  
  const handleBackClick = () => {
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
        <p>Analyzing samples from the storm...</p>
        <style jsx>{`
            .loading-screen {
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                height: 100vh; background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #312e81 100%);
                color: #f1f5f9;
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

  const scene = currentSceneData;
  if (!scene) return <div>Scene not found</div>;
  
  return (
    <div className="case-container">
      <div className="snow-overlay">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`snowflake snowflake-${i + 1}`}>
            <Snowflake className="w-4 h-4 text-white" />
          </div>
        ))}
      </div>
      <div className="scene-content">
        <div className="case-header">
          <div className="header-title">
            <Mountain className="w-8 h-8 text-blue-300" />
            <h1>Forensics: The Pine Ridge Lodge Mystery</h1>
          </div>
        </div>
        
        {sceneHistory.length > 1 && (
          <button onClick={handleBackClick} className="scene-back-button">
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>
        )}

        <div className="scene-box">
            <div className="scene-narration">
                <h2 className="scene-title">Forensic Summary</h2>
                <p className="narration">{scene.narration}</p>
            </div>

            {scene.exhibits && (
                <div className="clues-section">
                    <h3 className="section-title">Evidence for Analysis:</h3>
                    <div className="clues-grid">
                        {scene.exhibits.map((exhibit, index) => (
                            <div key={index} className="clue-tag" title={exhibit.description}>
                                {exhibit.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {scene.analysis && (
                <div className="clues-section">
                    <h3 className="section-title">Analysis Results: {scene.analysis.exhibit_id}</h3>
                    <div className="dialogue-item">
                        <p className="speaker-name">{scene.analysis.available_analyses[0].analysis_type.replace('_', ' ')}</p>
                        <p className="dialogue-text">{scene.analysis.available_analyses[0].results.summary}</p>
                    </div>
                </div>
            )}

            <div className="options-section">
                <h3 className="section-title">Forensic Actions:</h3>
                <div className="options-grid">
                {scene.options.map((option, index) => (
                    <button key={index} onClick={() => handleOptionClick(option)} className="option-btn">
                    {option.description}
                    </button>
                ))}
                </div>
            </div>
        </div>
      </div>
      
      <button onClick={() => router.back()} className="back-button">
        <ArrowLeft className="w-4 h-4" /> Return to Cases
      </button>
      <style jsx>{`
        .case-container {
          min-height: 100vh; background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #312e81 100%);
          color: #f1f5f9; font-family: "Inter", sans-serif; padding: 20px; position: relative; overflow-x: hidden;
        }
        .snow-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1; }
        .snowflake { position: absolute; animation: snowfall 8s linear infinite; }
        .snowflake-1 { top: -10px; left: 10%; animation-delay: 0s; }
        .snowflake-2 { top: -10px; left: 30%; animation-delay: 2s; }
        .snowflake-3 { top: -10px; left: 50%; animation-delay: 4s; }
        .snowflake-4 { top: -10px; left: 70%; animation-delay: 1s; }
        .snowflake-5 { top: -10px; left: 20%; animation-delay: 3s; }
        .snowflake-6 { top: -10px; left: 80%; animation-delay: 5s; }
        @keyframes snowfall {
          0% { transform: translateY(-10px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .scene-content { max-width: 900px; margin: 0 auto; position: relative; z-index: 2; display: flex; flex-direction: column; gap: 25px; }
        .case-header { text-align: center; margin-bottom: 30px; padding: 25px; background: rgba(30, 58, 138, 0.3); border-radius: 15px; border: 2px solid #3b82f6; box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2); backdrop-filter: blur(10px); }
        .header-title { display: flex; align-items: center; justify-content: center; gap: 15px; }
        .case-header h1 { font-size: 2.8rem; margin: 0; color: #dbeafe; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        .scene-back-button { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: rgba(71, 85, 105, 0.5); color: #e2e8f0; border: 2px solid #475569; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; align-self: flex-start; }
        .scene-back-button:hover { background: #475569; color: white; transform: translateX(-3px); }
        .scene-box { background: rgba(30, 41, 59, 0.8); padding: 30px; border-radius: 15px; border: 2px solid #475569; box-shadow: 0 8px 32px rgba(0,0,0,0.3); backdrop-filter: blur(10px); }
        .scene-title { font-size: 2rem; margin: 0 0 20px 0; color: #dbeafe; }
        .narration { font-size: 1.2rem; line-height: 1.7; color: #f1f5f9; margin-bottom: 25px; }
        .section-title { font-size: 1.4rem; color: #93c5fd; margin: 25px 0 15px 0; }
        .dialogue-item { background: rgba(59, 130, 246, 0.15); padding: 18px; border-radius: 10px; border-left: 4px solid #3b82f6; margin: 12px 0; }
        .speaker-name { font-weight: bold; color: #dbeafe; margin: 0 0 8px 0; font-size: 1.1rem; }
        .dialogue-text { font-style: italic; color: #f1f5f9; margin: 0; font-size: 1.05rem; }
        .clues-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .clue-tag { padding: 8px 16px; background: rgba(59, 130, 246, 0.3); color: #dbeafe; border-radius: 20px; font-size: 0.9rem; border: 1px solid #3b82f6; }
        .options-grid { display: grid; gap: 15px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        .option-btn { background: linear-gradient(45deg, #1e40af, #3b82f6); color: white; border: none; padding: 18px 24px; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .option-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); background: linear-gradient(45deg, #3b82f6, #60a5fa); }
        .back-button { position: fixed; bottom: 25px; left: 25px; display: flex; align-items: center; gap: 8px; background: transparent; border: 2px solid #3b82f6; color: #dbeafe; padding: 15px 25px; border-radius: 30px; font-size: 1.05rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px); }
        .back-button:hover { background: #3b82f6; color: white; transform: scale(1.05); }
        @media (max-width: 768px) { .case-header h1 { font-size: 2.2rem; } .options-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
