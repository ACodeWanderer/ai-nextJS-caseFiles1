"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const forensicCaseFile = {
  case_name: "Case File: 75-LOUVRE-HEIST",
  exhibits: [
    {
      exhibit_id: "EXH-001",
      item_description: "A section of security wire, approximately 3mm in diameter, severed with a clean, precise cut.",
      collection_location: "Floor beneath the empty frame, Renaissance wing, Louvre Museum.",
      contamination_risk: "LOW",
      available_analyses: [
        {
          analysis_id: "TMA-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Metallurgical analysis shows no trace metal shearing, characteristic of pressure cutters. The cut surface is smooth, suggesting a high-temperature thermal or advanced ceramic blade. This indicates a sophisticated, non-standard tool was used.",
           is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-002",
      item_description: "Three latent fingerprints lifted from the lower-left corner of the glass display case that housed the painting.",
      collection_location: "Glass display case, Renaissance wing, Louvre Museum.",
      contamination_risk: "HIGH",
      available_analyses: [
        {
          analysis_id: "FPA-001",
          analysis_type: "FINGERPRINT_ANALYSIS",
          results: {
            summary: "Automated Fingerprint Identification System (AFIS) comparison returned no matches to known criminals or museum staff. The prints are degraded, suggesting they are not recent or were partially wiped.",
           is_conclusive: false,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-003",
      item_description: "One microscopic paint chip (approx. 500 micrometers) with a distinct dark red and yellow layering.",
      collection_location: "On the floor near the gallery's east wall, approximately 4 meters from the crime scene.",
      contamination_risk: "MEDIUM",
      available_analyses: [
        {
          analysis_id: "PIG-001",
          analysis_type: "CHEMICAL_ANALYSIS",
          results: {
            summary: "Gas chromatography-mass spectrometry reveals the chip contains a rare lead-tin-yellow pigment, phased out of common use in the early 17th century. The pigment's chemical signature is a direct match to samples from a Caravaggio painting at the center of a well-publicized legal dispute between the Louvre and art dealer Vincent Delacroix five years prior.",
           is_conclusive: true,
          }
        }
      ]
    },
    {
      exhibit_id: "EXH-004",
      item_description: "A small, high-quality linen cardstock left inside the empty frame. A single sentence is written in elegant script.",
      collection_location: "Inside the empty frame of 'La Belle Ferronnière', Renaissance wing.",
      contamination_risk: "LOW",
      available_analyses: [
        {
          analysis_id: "UVS-001",
          analysis_type: "UV_SCANNING",
          results: {
            summary: "Ultraviolet scanning reveals a faint watermark: the logo of 'Montmartre Fine Art Supplies,' a specialty shop known for supplying restoration and forgery materials. This suggests the perpetrator has interests not only in stealing art but potentially in creating it as well.",
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
    narration: "The forensic laboratory receives four evidence containers from the Louvre Museum, collected in relation to the theft of 'La Belle Ferronnière'. The chain of custody is verified, and the exhibits are logged for processing. Each item represents a potential link to the perpetrator, and the investigation begins with the systematic analysis of this physical evidence.",
    clues: forensicCaseFile.exhibits.map(exhibit => ({
      clue_id: exhibit.exhibit_id,
      name: `Exhibit ${exhibit.exhibit_id}: ${exhibit.item_description.split(',')[0]}`,
      description: `Description: ${exhibit.item_description} | Location: ${exhibit.collection_location} | Contamination Risk: ${exhibit.contamination_risk}`,
    })),
    options: forensicCaseFile.exhibits.map(exhibit => ({
      option_id: `opt_analyze_${exhibit.exhibit_id}`,
      description: `Begin Analysis on ${exhibit.exhibit_id}`,
      next_scene: `scene_2_results_${exhibit.exhibit_id}`,
    })),
  },
  ...forensicCaseFile.exhibits.flatMap(exhibit => [
    {
      scene_id: `scene_2_results_${exhibit.exhibit_id}`,
      narration: `Forensic analysis of Exhibit ${exhibit.exhibit_id} is complete. The findings from the ${exhibit.available_analyses[0].analysis_type.replace('_', ' ')} are detailed below.`,
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
    narration: "All available analyses have been concluded. The cumulative evidence provides a strong forensic profile. The use of a sophisticated cutting tool (EXH-001) and meticulous cleaning of fingerprints (EXH-002) indicate a professional with technical knowledge. The watermark on the calling card (EXH-004) suggests a connection to the world of art forgery. However, the most conclusive piece of evidence is the paint chip (EXH-003). Its unique composition provides a direct material link between the crime scene and art dealer Vincent Delacroix, who has a known history and motive related to the specific artwork matched by the sample. The forensic evidence strongly indicates that Vincent Delacroix is a primary person of interest in this theft.",
    options: [
      {
        option_id: "opt_close_case",
        description: "Case Closed - File Final Report to Detective Dubois",
        next_scene: "case_solved",
      },
    ],
  },
];

export default function ArtTheftParisPage() {
  const router = useRouter()
  const [currentScene, setCurrentScene] = useState("scene_1_intake")
  const [discoveredClues, setDiscoveredClues] = useState([])

  const currentSceneData = sceneData.find((scene) => scene.scene_id === currentScene)

  useEffect(() => {
    if (currentSceneData && currentSceneData.clues) {
      setDiscoveredClues(currentSceneData.clues)
    }
  }, [currentScene, currentSceneData])

  const handleOptionClick = (nextScene) => {
    if (nextScene === "case_solved") {
      alert(
        "Forensic Report Submitted. Evidence points to Vincent Delacroix due to a direct material link from a unique paint sample found at the scene."
      )
      return
    }
    setCurrentScene(nextScene)
  }

  if (!currentSceneData) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Accessing Forensic Database...</p>
<style jsx>{`
.loading-screen {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
height: 100vh;
background: linear-gradient(135deg, #7f1d1d, #d97706);
color: #fbbf24;
font-family: serif;
}
.loading-spinner {
width: 60px;
height: 60px;
border: 3px solid rgba(251, 191, 36, 0.3);
border-top: 3px solid #fbbf24;
border-radius: 50%;
animation: spin 1s linear infinite;
margin-bottom: 20px;
}
@keyframes spin {
0% { transform: rotate(0deg); }
100% { transform: rotate(360deg); }
}
`}</style>
      </div>
    )
  }
  return (
    <>
      <div className="case-container">
        <div className="case-header">
          <h1>Forensic Report: The Louvre Heist</h1>
          <p className="subtitle">{forensicCaseFile.case_name}</p>
          <div className="status-bar">
            <div className="clues-counter">
              <span className="label">EXHIBITS:</span>
              <span className="count">{forensicCaseFile.exhibits.length}</span>
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
              <span className="icon"> 🏛️ </span>
              <h3>FORENSIC NOTES</h3>
            </div>
            <p className="narration">{currentSceneData.narration}</p>
          </div>

          {currentSceneData.clues && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon"> 🔍 </span>
                <h3>EVIDENCE FOR ANALYSIS</h3>
              </div>
              {currentSceneData.clues.map((clue, index) => (
                <div key={index} className="clue-item">
                  <div className="clue-header">
                    <strong className="clue-name">{clue.name.toUpperCase()}</strong>
                    <span className="clue-status">LOGGED</span>
                  </div>
                  <p className="clue-description">{clue.description}</p>
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
                  <span className="clue-status" style={{ background: currentSceneData.analysis.available_analyses[0].results.is_conclusive ? '#f59e0b' : '#9ca3af' }}>
                    {currentSceneData.analysis.available_analyses[0].results.is_conclusive ? "CONCLUSIVE" : "INCONCLUSIVE"}
                  </span>
                </div>
                <p className="clue-description">{currentSceneData.analysis.available_analyses[0].results.summary}</p>
              </div>
            </div>
          )}

          <div className="options-section">
            <div className="section-header">
              <span className="icon"> ⚖️ </span>
              <h3>NEXT ACTION</h3>
            </div>
            <div className="options-grid">
              {currentSceneData.options.map((option, index) => (
                <button key={index} className="option-btn" onClick={() => handleOptionClick(option.next_scene)}>
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
background: linear-gradient(135deg, #7f1d1d, #d97706, #fbbf24);
color: #fbbf24;
font-family: serif;
padding: 20px;
position: relative;
overflow-x: hidden;
}
.case-header {
text-align: center;
margin-bottom: 30px;
padding: 25px;
background: rgba(251, 191, 36, 0.1);
border-radius: 10px;
border: 2px solid #fbbf24;
box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
backdrop-filter: blur(10px);
}
.case-header h1 {
font-size: 2.5rem;
margin: 0 0 10px 0;
color: #fbbf24;
text-shadow: 0 0 15px rgba(251, 191, 36, 0.8);
letter-spacing: 2px;
}
.subtitle {
font-size: 1.2rem;
color: #f59e0b;
font-style: italic;
margin-bottom: 15px;
}
.status-bar {
display: flex;
justify-content: center;
gap: 40px;
font-size: 1.1rem;
}
.clues-counter, .scene-indicator {
display: flex;
align-items: center;
gap: 8px;
}
.label {
color: #dc2626;
font-weight: bold;
}
.count, .scene-id {
color: #fbbf24;
background: rgba(251, 191, 36, 0.2);
padding: 4px 8px;
border-radius: 4px;
}
.scene-content {
max-width: 900px;
margin: 0 auto;
display: flex;
flex-direction: column;
gap: 25px;
}
.narration-box,
.dialogue-section,
.clues-section,
.options-section {
background: rgba(127, 29, 29, 0.7);
padding: 25px;
border-radius: 10px;
border: 1px solid #fbbf24;
box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
backdrop-filter: blur(5px);
}
.section-header {
display: flex;
align-items: center;
gap: 10px;
margin-bottom: 20px;
padding-bottom: 10px;
border-bottom: 1px solid rgba(251, 191, 36, 0.3);
}
.section-header .icon {
font-size: 1.2rem;
}
.section-header h3 {
margin: 0;
color: white;
text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
font-size: 1.2rem;
letter-spacing: 1px;
}
.narration {
font-size: 1.1rem;
line-height: 1.7;
color: #fef3c7;
font-style: italic;
}
.clues-section {
border-color: #f59e0b;
box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
}
.clue-item {
background: rgba(245, 158, 11, 0.1);
padding: 18px;
border-radius: 8px;
margin: 15px 0;
border: 1px solid #f59e0b;
}
.clue-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 8px;
}
.clue-name {
color: #f59e0b;
font-size: 1.1rem;
}
.clue-status {
background: #f59e0b;
color: #000;
padding: 2px 8px;
border-radius: 10px;
font-size: 0.8rem;
font-weight: bold;
}
.clue-description {
color: #fef3c7;
margin: 0;
line-height: 1.5;
}
.options-grid {
display: grid;
gap: 15px;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.option-btn {
background: linear-gradient(45deg, #dc2626, #f59e0b);
color: #000;
border: none;
padding: 20px 28px;
border-radius: 8px;
font-size: 1rem;
font-weight: bold;
cursor: pointer;
transition: all 0.3s ease;
position: relative;
font-family: serif;
overflow: hidden;
min-height: 60px;
display: flex;
align-items: center;
justify-content: center;
}
.option-btn:hover {
transform: translateY(-3px);
box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
}
.btn-glow {
position: absolute;
top: 0;
left: -100%;
width: 100%;
height: 100%;
background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
transition: left 0.5s;
}
.option-btn:hover .btn-glow {
left: 100%;
}
.back-button {
position: fixed;
bottom: 20px;
left: 20px;
background: transparent;
border: 2px solid #fbbf24;
color: #fbbf24;
padding: 15px 25px;
border-radius: 25px;
font-size: 1rem;
font-weight: bold;
cursor: pointer;
transition: all 0.3s ease;
font-family: serif;
}
.back-button:hover {
background: #fbbf24;
color: #7f1d1d;
box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
transform: scale(1.05);
}
@media (max-width: 768px) {
.case-header h1 {
font-size: 2rem;
}
.status-bar {
flex-direction: column;
gap: 15px;
}
.options-grid {
grid-template-columns: 1fr;
}
}
`}</style>
    </>
  )
}
