"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

// --- Type Definitions ---

interface AnalysisResult {
  summary: string;
  unlocks_new_exhibits?: string[];
  is_conclusive: boolean;
}

interface AvailableAnalysis {
  analysis_type: string;
  analysis_id: string;
  results: AnalysisResult;
}

interface Exhibit {
  item_description: string;
  exhibit_id: string;
  available_analyses: AvailableAnalysis[];
  contamination_risk: string;
  collection_location: string;
}

interface StoryData {
  story: {
    case_name: string;
    exhibits: Exhibit[];
  };
}

interface SceneOption {
  description: string;
  next_scene: string;
}

interface SceneExhibit {
  name: string;
  description: string;
}

interface SceneAnalysis {
  exhibit_id: string;
  available_analyses: AvailableAnalysis[];
}

interface Scene {
  scene_id: string;
  narration: string;
  exhibits?: SceneExhibit[];
  options: SceneOption[];
  analysis?: SceneAnalysis;
}

// --- Fallback Mock Data ---
const fallbackData: StoryData = {
  story: {
    case_name: "Lord Ashworth Manor Death",
    exhibits: [
      {
        item_description:
          "The victim, Lord Ashworth, was found deceased in his study.  Cause of death is undetermined pending autopsy.  The room shows signs of a struggle; overturned furniture and a broken antique clock.",
        exhibit_id: "EXH-001",
        available_analyses: [
          {
            analysis_type: "FINGERPRINT_ANALYSIS",
            analysis_id: "ANA-001",
            results: {
              summary:
                "Fingerprints were collected from the overturned furniture and the broken clock. Analysis is pending.",
              unlocks_new_exhibits: ["EXH-006"],
              is_conclusive: false,
            },
          },
          {
            analysis_type: "CHEMICAL_ANALYSIS",
            results: {
              unlocks_new_exhibits: ["EXH-007"],
              summary:
                "Preliminary chemical analysis of the study revealed traces of an unknown substance near the victim.",
              is_conclusive: false,
            },
            analysis_id: "ANA-002",
          },
        ],
        contamination_risk: "MEDIUM",
        collection_location: "Lord Ashworth's study, Ashworth Manor",
      },
      {
        collection_location: "Lord Ashworth's study, Ashworth Manor",
        contamination_risk: "MEDIUM",
        exhibit_id: "EXH-002",
        available_analyses: [
          {
            results: {
              is_conclusive: false,
              summary:
                "DNA analysis of the blood on the letter opener is pending.",
            },
            analysis_type: "DNA_ANALYSIS",
            analysis_id: "ANA-003",
          },
          {
            results: {
              summary: "Fingerprint analysis of the letter opener is pending.",
              is_conclusive: false,
            },
            analysis_id: "ANA-004",
            analysis_type: "FINGERPRINT_ANALYSIS",
          },
        ],
        item_description:
          "A bloodstained letter opener was found near the victim's body. The handle shows signs of being gripped forcefully.",
      },
      {
        item_description:
          "A torn piece of paper was found near the fireplace, appearing to be a fragment of a will or financial document.",
        available_analyses: [
          {
            analysis_id: "ANA-005",
            analysis_type: "CHEMICAL_ANALYSIS",
            results: {
              is_conclusive: false,
              summary:
                "Chemical analysis of the paper fragment revealed traces of ink and paper fibers.",
            },
          },
        ],
        collection_location: "Lord Ashworth's study, Ashworth Manor",
        contamination_risk: "LOW",
        exhibit_id: "EXH-003",
      },
      {
        collection_location: "Ashworth Manor, main hall",
        available_analyses: [
          {
            results: {
              is_conclusive: false,
              summary:
                "Psychological evaluation reveals signs of grief but also potential for deception; further investigation is warranted.",
            },
            analysis_type: "PSYCHOLOGICAL_EVALUATION",
            analysis_id: "ANA-006",
          },
        ],
        exhibit_id: "EXH-004",
        item_description:
          "Lady Beatrice Ashworth, the victim's wife, was visibly distraught upon discovery of the body. She exhibited erratic behavior, including rapid speech and shallow breathing.",
        contamination_risk: "LOW",
      },
      {
        available_analyses: [
          {
            analysis_type: "PSYCHOLOGICAL_EVALUATION",
            results: {
              is_conclusive: false,
              summary:
                "Psychological evaluation shows signs of suppressed emotion and potential for deception.",
            },
            analysis_id: "ANA-007",
          },
        ],
        collection_location: "Ashworth Manor, main hall",
        item_description:
          "Mr. Edgar Ashworth, the victim's son, remained unusually calm, showing minimal emotional response to the discovery of his father's body. He was seen wiping his hands repeatedly.",
        exhibit_id: "EXH-005",
        contamination_risk: "LOW",
      },
    ],
  },
};

/**
 * Transforms the flat exhibit data into a scene-based structure the UI component can render.
 * @param {StoryData} storyData - The raw story data from the API or fallback.
 * @returns {Scene[]} An array of scene objects.
 */
const generateSceneData = (storyData: StoryData | null): Scene[] => {
  if (!storyData || !storyData.story) return [];

  const { exhibits } = storyData.story;
  const scenes: Scene[] = [];

  // 1. Create the main "Intake" scene
  const intakeScene: Scene = {
    scene_id: "scene_intake",
    narration:
      "Initial evidence has been collected from the scene at Ashworth Manor. Review the available exhibits and select one for forensic analysis.",
    exhibits: exhibits.map((exhibit: Exhibit) => ({
      name: exhibit.exhibit_id,
      description: exhibit.item_description,
    })),
    options: exhibits.flatMap((exhibit: Exhibit) =>
      exhibit.available_analyses.map((analysis: AvailableAnalysis) => ({
        description: `Perform ${analysis.analysis_type.replace(/_/g, " ")} on ${
          exhibit.exhibit_id
        }`,
        next_scene: `scene_${analysis.analysis_id}`,
      }))
    ),
  };
  scenes.push(intakeScene);

  // 2. Create a scene for each available analysis
  exhibits.forEach((exhibit: Exhibit) => {
    exhibit.available_analyses.forEach((analysis: AvailableAnalysis) => {
      const analysisScene: Scene = {
        scene_id: `scene_${analysis.analysis_id}`,
        narration: `Forensic analysis of Exhibit ${exhibit.exhibit_id} is complete. Review the findings below.`,
        analysis: {
          exhibit_id: exhibit.exhibit_id,
          available_analyses: [analysis], // The component expects an array
        },
        options: [
          {
            description: "Return to Evidence Locker",
            next_scene: "scene_intake",
          },
          // Add a final option on the key piece of evidence
          ...(analysis.analysis_id === "ANA-004"
            ? [
                {
                  description: "Submit Final Report",
                  next_scene: "case_solved",
                },
              ]
            : []),
        ],
      };
      scenes.push(analysisScene);
    });
  });

  return scenes;
};

export default function ForensicManorDeathPage() {
  const router = useRouter();

  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [currentScene, setCurrentScene] = useState<string>("scene_intake");
  const [discoveredAnalyses, setDiscoveredAnalyses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_intake"]);
  const [storyName, setStoryName] = useState<string>("");

  // --- API Call Simulation ---
  useEffect(() => {
    const fetchStoryData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post<StoryData>(
          "http://localhost:8000/api/forensic-story",
          {
            case: "art_theft_paris",
          }
        );
        setStoryData(response.data);
        setStoryName(response.data.story.case_name);
      } catch (error) {
        console.warn("API call failed. Using fallback mock data.", error);
        setStoryData(fallbackData);
        setStoryName(fallbackData.story.case_name);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    if (!storyData) fetchStoryData();
  }, []);

  // Memoize the generated data to avoid re-computation on every render
  const { forensicCaseFile, sceneData } = useMemo(() => {
    if (!storyData) {
      return { forensicCaseFile: null, sceneData: [] };
    }
    return {
      forensicCaseFile: storyData.story,
      sceneData: generateSceneData(storyData),
    };
  }, [storyData]);

  const currentSceneData: Scene | undefined = sceneData.find(
    (scene) => scene.scene_id === currentScene
  );

  const handleOptionClick = (option: SceneOption) => {
    if (currentSceneData?.analysis) {
      setDiscoveredAnalyses((prev) => [
        ...new Set([...prev, currentSceneData.analysis!.exhibit_id]),
      ]);
    }

    if (option.next_scene === "case_solved") {
      alert(
        "Forensic Report Submitted. Evidence strongly implicates Mr. Edgar Ashworth. His fingerprints and DNA were on the weapon, and he is the sole beneficiary of a new life insurance policy. Psychological evaluation suggests he is concealing information."
      );
      return;
    }
    setSceneHistory((prev) => [...prev, option.next_scene]);
    setCurrentScene(option.next_scene);
  };

  const goToPreviousScene = () => {
    if (sceneHistory.length > 1) {
      const newHistory = [...sceneHistory];
      newHistory.pop();
      const previousScene = newHistory[newHistory.length - 1];
      setSceneHistory(newHistory);
      setCurrentScene(previousScene);
    }
  };

  if (isLoading || !forensicCaseFile || !currentSceneData) {
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
            background: linear-gradient(135deg, #1a2a3a, #4a3a3a);
            color: #d1c4e9;
            font-family: serif;
          }
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(209, 196, 233, 0.3);
            border-top: 3px solid #d1c4e9;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="case-container">
        {sceneHistory.length > 1 && (
          <button className="previous-scene-button" onClick={goToPreviousScene}>
            <span>← Previous Step</span>
          </button>
        )}
        <div className="case-header">
          <h1>Forensic Report: {storyName}</h1>
          <p className="subtitle">{forensicCaseFile.case_name}</p>
          <div className="status-bar">
            <div className="clues-counter">
              <span className="label">EXHIBITS ANALYZED:</span>
              <span className="count">
                {discoveredAnalyses.length}/{forensicCaseFile.exhibits.length}
              </span>
            </div>
            <div className="scene-indicator">
              <span className="label">CURRENT VIEW:</span>
              <span className="scene-id">
                {currentSceneData.analysis
                  ? `${currentSceneData.analysis.exhibit_id} RESULTS`
                  : "EVIDENCE LOCKER"}
              </span>
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

          {currentSceneData.exhibits && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon"> 🔍 </span>
                <h3>EVIDENCE QUEUE</h3>
              </div>
              {currentSceneData.exhibits.map((exhibit, index) => (
                <div key={index} className="clue-item">
                  <div className="clue-header">
                    <strong className="clue-name">
                      {exhibit.name.toUpperCase()}
                    </strong>
                    <span
                      className={`clue-status ${
                        discoveredAnalyses.includes(exhibit.name)
                          ? "ANALYZED"
                          : "PENDING"
                      }`}
                    >
                      {discoveredAnalyses.includes(exhibit.name)
                        ? "ANALYZED"
                        : "PENDING"}
                    </span>
                  </div>
                  <p className="clue-description">{exhibit.description}</p>
                </div>
              ))}
            </div>
          )}

          {currentSceneData.analysis && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon"> 🔬 </span>
                <h3>
                  ANALYSIS RESULTS: {currentSceneData.analysis.exhibit_id}
                </h3>
              </div>
              <div className="clue-item">
                <div className="clue-header">
                  <strong className="clue-name">
                    {currentSceneData.analysis.available_analyses[0].analysis_type.replace(
                      /_/g,
                      " "
                    )}
                  </strong>
                  <span
                    className={`clue-status ${
                      currentSceneData.analysis.available_analyses[0].results
                        .is_conclusive
                        ? "verified"
                        : "inconclusive"
                    }`}
                  >
                    {currentSceneData.analysis.available_analyses[0].results
                      .is_conclusive
                      ? "CONCLUSIVE"
                      : "INCONCLUSIVE"}
                  </span>
                </div>
                <p className="clue-description">
                  {
                    currentSceneData.analysis.available_analyses[0].results
                      .summary
                  }
                </p>
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
        /* --- All of your original, unchanged CSS goes here --- */
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1d3b53, #465873, #6f7f95);
          color: #e0e7ef;
          font-family: serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }
        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(224, 231, 239, 0.1);
          border-radius: 10px;
          border: 2px solid #9fb3c8;
          box-shadow: 0 0 20px rgba(159, 179, 200, 0.3);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          color: #e0e7ef;
          text-shadow: 0 0 15px rgba(224, 231, 239, 0.8);
          letter-spacing: 2px;
        }
        .subtitle {
          font-size: 1.2rem;
          color: #b0c4de;
          font-style: italic;
          margin-bottom: 15px;
        }
        .status-bar {
          display: flex;
          justify-content: center;
          gap: 40px;
          font-size: 1.1rem;
        }
        .clues-counter,
        .scene-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .label {
          color: #ff6b6b;
          font-weight: bold;
        }
        .count,
        .scene-id {
          color: #e0e7ef;
          background: rgba(176, 196, 222, 0.2);
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
          background: rgba(29, 59, 83, 0.7);
          padding: 25px;
          border-radius: 10px;
          border: 1px solid #6f7f95;
          box-shadow: 0 0 15px rgba(111, 127, 149, 0.2);
          backdrop-filter: blur(5px);
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(111, 127, 149, 0.3);
        }
        .section-header .icon {
          font-size: 1.2rem;
        }
        .section-header h3 {
          margin: 0;
          color: white;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
            1px 1px 0 #000;
          font-size: 1.2rem;
          letter-spacing: 1px;
        }
        .narration {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #d4dde7;
          font-style: italic;
        }
        .clues-section {
          border-color: #6495ed;
          box-shadow: 0 0 15px rgba(100, 149, 237, 0.2);
        }
        .clue-item {
          background: rgba(100, 149, 237, 0.1);
          padding: 18px;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid #6495ed;
        }
        .clue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .clue-name {
          color: #87ceeb;
          font-size: 1.1rem;
        }
        .clue-status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
          color: #fff;
        }
        .clue-status.PENDING {
          background: #f0ad4e;
        }
        .clue-status.ANALYZED {
          background: #5bc0de;
        }
        .clue-status.verified {
          background: #5cb85c;
        }
        .clue-status.inconclusive {
          background: #777;
        }
        .clue-description {
          color: #d4dde7;
          margin: 0;
          line-height: 1.5;
        }
        .options-grid {
          display: grid;
          gap: 15px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .option-btn {
          background: linear-gradient(45deg, #4e73df, #224abe);
          color: #fff;
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
          box-shadow: 0 8px 25px rgba(34, 74, 190, 0.4);
        }
        .btn-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
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
          border: 2px solid #9fb3c8;
          color: #9fb3c8;
          padding: 15px 25px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: serif;
        }
        .back-button:hover {
          background: #9fb3c8;
          color: #1d3b53;
          box-shadow: 0 0 20px rgba(159, 179, 200, 0.5);
          transform: scale(1.05);
        }
        .previous-scene-button {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(159, 179, 200, 0.2);
          border: 2px solid #b0c4de;
          color: #b0c4de;
          padding: 10px 18px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: "serif";
          z-index: 1000;
        }
        .previous-scene-button:hover {
          background: #b0c4de;
          color: #1d3b53;
          box-shadow: 0 0 20px rgba(176, 196, 222, 0.5);
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
  );
}
