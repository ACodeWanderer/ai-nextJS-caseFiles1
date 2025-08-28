"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ArrowLeft, BookOpen, Search, Users, FileText } from "lucide-react"

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
        "Forensic Report Submitted. Evidence indicates Professor Hartwell died by suicide, exploiting his own medical condition. Dean Margaret Ashford was present and subsequently tampered with the scene, warranting charges of assisted suicide and obstruction of justice."
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
        <p>Accessing university archives...</p>
        <style jsx>{`
            .loading-screen {
                display: flex; flex-direction: column; justify-content: center; align-items: center;
                height: 100vh; background: linear-gradient(135deg, #7c2d92 0%, #a855f7 50%, #6b21a8 100%);
                color: #fef3c7;
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

  const scene = currentSceneData;
  if (!scene) return <div>Scene not found</div>;
  
  return (
    <div
        className="min-h-screen"
        style={{
        background: "linear-gradient(135deg, #7c2d92 0%, #a855f7 50%, #6b21a8 100%)",
        color: "#fef3c7", padding: "20px",
        }}
    >
        {sceneHistory.length > 1 && (
            <div className="fixed top-6 left-6 z-50">
                <button onClick={handleBackClick} className="previous-scene-button">
                    <ChevronLeft className="w-4 h-4" /> Previous Step
                </button>
            </div>
        )}
        <div className="scene-content">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-amber-400" />
                    <h1 className="text-3xl font-serif text-amber-200">Forensics: The Professor's Study</h1>
                </div>
            </div>

            <div className="narration-box">
                <h2 className="text-xl font-serif text-amber-300 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Forensic Summary
                </h2>
                <p className="text-amber-100 leading-relaxed text-lg font-serif">{scene.narration}</p>
            </div>

            {scene.exhibits && (
                <div className="options-section">
                    <h3 className="text-lg font-serif text-amber-300 mb-4">Evidence for Analysis:</h3>
                    <div className="options-grid">
                        {scene.exhibits.map((exhibit, index) => (
                             <div key={index} className="clue-item">
                                <div className="clue-name">{exhibit.name}</div>
                                <div className="text-xs text-amber-200 mt-1">{exhibit.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {scene.analysis && (
                <div className="narration-box">
                    <h2 className="text-xl font-serif text-amber-300 mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5" /> Analysis Results: {scene.analysis.exhibit_id}
                    </h2>
                    <div className="clue-item" style={{background: 'rgba(0,0,0,0.2)'}}>
                        <div className="clue-name">{scene.analysis.available_analyses[0].analysis_type.replace('_', ' ')}</div>
                        <p className="text-amber-100 leading-relaxed mt-2">{scene.analysis.available_analyses[0].results.summary}</p>
                    </div>
                </div>
            )}
            
            <div className="options-section">
                <h3 className="text-lg font-serif text-amber-300 mb-4">Forensic Actions:</h3>
                <div className="options-grid">
                    {scene.options.map((option, index) => (
                    <button key={index} onClick={() => handleOptionClick(option)} className="option-button">
                        {option.description}
                    </button>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="fixed bottom-6 left-6">
            <button onClick={() => router.push("/")} className="return-button">
                <ArrowLeft className="w-4 h-4" /> Return to Cases
            </button>
        </div>
      <style jsx>{`
        .scene-content { max-width: 900px; margin: 0 auto; }
        .narration-box, .options-section {
            background: rgba(0,0,0,0.3); backdrop-filter: blur(10px);
            border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px;
            padding: 32px; margin-bottom: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .options-grid { display: grid; gap: 16px; }
        .option-button, .return-button, .previous-scene-button {
            display: flex; align-items: center; gap: 8px; text-align: left; padding: 16px 24px;
            background: rgba(0,0,0,0.4); border: 1px solid rgba(251, 191, 36, 0.4);
            border-radius: 8px; color: #fef3c7; font-size: 16px; font-weight: 500;
            cursor: pointer; transition: all 0.3s ease;
        }
        .option-button:hover, .return-button:hover, .previous-scene-button:hover {
            background: rgba(251, 191, 36, 0.2); border-color: rgba(251, 191, 36, 0.6);
            transform: translateY(-2px);
        }
        .clue-item {
            background: rgba(0,0,0,0.1); border: 1px solid rgba(251, 191, 36, 0.2);
            border-radius: 8px; padding: 12px;
        }
        .clue-name { color: white; font-size: 0.875rem; font-weight: 500; }
      `}</style>
    </div>
  )
}
