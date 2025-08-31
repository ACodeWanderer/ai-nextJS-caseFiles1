"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";

// --- Type Definitions for Incoming Data ---
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

interface ForensicStoryData {
  story: {
    case_name: string;
    exhibits: Exhibit[];
  };
}

// --- Type Definitions for UI Component ---
interface Clue {
  clue_id: string;
  name: string;
  description: string;
}

interface Dialogue {
  character: string;
  speech: string;
}

interface Option {
  option_id: string;
  next_scene: string;
  description: string;
}

interface Scene {
  scene_id: string;
  narration: string;
  options: Option[];
  clues?: Clue[];
  dialogues?: Dialogue[];
}

interface NarrativeCaseData {
  title: string;
  scenes: Scene[];
}

// --- Fallback Mock Data ---
const fallbackData: ForensicStoryData = {
  story: {
    exhibits: [
      {
        item_description:
          "A single woman's high-heeled shoe, size 7, made of red patent leather. A prominent black scuff mark is visible on the outer side of the heel. The inner sole displays moderate wear, and the manufacturer's label, 'The Starlight Room,' is faded.",
        collection_location: "Nightclub back alley, near dumpster",
        contamination_risk: "MEDIUM",
        available_analyses: [
          {
            results: {
              unlocks_new_exhibits: ["EXH-004"],
              summary:
                "Gas chromatography-mass spectrometry (GC-MS) of the scuff mark reveals compounds consistent with vulcanized rubber from a specific brand of vintage automobile tire ('All-State') popular in the late 1940s. Trace amounts of tetraethyllead indicate exposure to leaded gasoline.",
              is_conclusive: true,
            },
            analysis_id: "CA-001",
            analysis_type: "CHEMICAL_ANALYSIS",
          },
          {
            analysis_type: "UV_SCANNING",
            results: {
              is_conclusive: false,
              summary:
                "Ultraviolet scanning reveals no significant biological traces or latent prints on the exterior of the shoe. The patent leather has absorbed the UV light, making detailed analysis difficult.",
              unlocks_new_exhibits: [],
            },
            analysis_id: "UV-001",
          },
        ],
        exhibit_id: "EXH-001",
      },
      {
        item_description:
          "A brass lipstick tube with an art deco design, containing a deep crimson lipstick ('Midnight Ruby' shade). The tube is cool to the touch and has a noticeable smudge on its side, obscuring the manufacturer's engraving. The mechanism for extending the lipstick is functional.",
        available_analyses: [
          {
            analysis_type: "FINGERPRINT_ANALYSIS",
            analysis_id: "FA-001",
            results: {
              unlocks_new_exhibits: [],
              is_conclusive: false,
              summary:
                "Cyanoacrylate fuming reveals two sets of latent fingerprints on the brass tube. Set A is a full set belonging to the victim, Lila Skye. Set B is a partial, smudged print from an unknown individual with insufficient ridge detail for a positive identification.",
            },
          },
          {
            analysis_type: "DNA_ANALYSIS",
            analysis_id: "DA-001",
            results: {
              unlocks_new_exhibits: ["EXH-005"],
              is_conclusive: true,
              summary:
                "DNA analysis of the lipstick tip yields a full profile matching the victim, Lila Skye. Trace DNA recovered from the smudged surface of the tube (corresponding to fingerprint Set B) yields a partial but usable profile of an unknown male.",
            },
          },
          {
            analysis_id: "CA-002",
            analysis_type: "CHEMICAL_ANALYSIS",
            results: {
              is_conclusive: true,
              unlocks_new_exhibits: [],
              summary:
                "Chemical profiling of the lipstick confirms its composition includes carmine and a unique, custom-blended perfume oil containing sandalwood and night-blooming jasmine, matching the victim's signature scent. No foreign compounds were detected.",
            },
          },
        ],
        contamination_risk: "LOW",
        collection_location: "Nightclub back alley, near stage door",
        exhibit_id: "EXH-002",
      },
      {
        collection_location: "Nightclub back alley, under dumpster",
        available_analyses: [
          {
            results: {
              unlocks_new_exhibits: ["EXH-006"],
              summary:
                "Scanning the vinyl surface under ultraviolet light reveals a faint, greasy residue within the grooves that is inconsistent with the polyvinyl chloride material. The residue is concentrated around the deep scratches, suggesting a temporal link between their creations.",
              is_conclusive: true,
            },
            analysis_id: "UV-002",
            analysis_type: "UV_SCANNING",
          },
          {
            analysis_id: "FA-002",
            results: {
              is_conclusive: false,
              summary:
                "Analysis of the record's surface reveals multiple overlapping and smudged prints, rendering individual identification impossible due to the item's handling and exposure to the elements.",
              unlocks_new_exhibits: [],
            },
            analysis_type: "FINGERPRINT_ANALYSIS",
          },
        ],
        contamination_risk: "HIGH",
        exhibit_id: "EXH-003",
        item_description:
          "A 12-inch vinyl LP record with the label 'Lila Skye - Live at the Blue Canary.' The surface is marred by several deep, parallel scratches that appear to have been deliberately made. The record is coated in a thin layer of grime and shows evidence of water damage along one edge.",
      },
      {
        collection_location: "Nightclub back alley",
        contamination_risk: "LOW",
        available_analyses: [
          {
            results: {
              unlocks_new_exhibits: [],
              summary:
                "Microscopic analysis of the soil particles embedded in the plaster cast reveals a unique mineral composition, including feldspar and mica, consistent with the soil found at the alleyway. This confirms the cast was made at the primary scene. Tire pattern analysis confirms a match with the 'All-State' brand.",
              is_conclusive: true,
            },
            analysis_id: "MA-004",
            analysis_type: "CHEMICAL_ANALYSIS",
          },
        ],
        item_description:
          "A plaster cast of a tire tread impression taken from the soft soil next to the alley dumpster. The tread pattern is well-defined, showing a 'diamond and bar' design with visible wear on the outer edge. The cast is approximately 6 inches wide.",
        exhibit_id: "EXH-004",
      },
      {
        collection_location: "Forensic Lab",
        available_analyses: [],
        exhibit_id: "EXH-005",
        item_description:
          "A digital file containing a Short Tandem Repeat (STR) DNA profile generated from epithelial cells found on exhibit EXH-002. The profile is designated 'Unknown Male B.' The data is stored on a secure server pending comparison with a reference sample.",
        contamination_risk: "LOW",
      },
      {
        available_analyses: [
          {
            analysis_type: "CHEMICAL_ANALYSIS",
            results: {
              summary:
                "GC-MS analysis identifies the residue as a high-grade, silicone-based lubricant. The chemical signature matches lubricants used for professional reel-to-reel audio tape machines to ensure smooth tape transport, a substance not typically found in a nightclub alley.",
              is_conclusive: true,
              unlocks_new_exhibits: ["EXH-007"],
            },
            analysis_id: "CA-006",
          },
        ],
        item_description:
          "A sterile sample container holding the greasy, translucent residue lifted from the grooves of the vinyl record (EXH-003). The sample was collected using a solvent-moistened cotton swab and is preserved for chemical analysis.",
        contamination_risk: "LOW",
        collection_location: "Forensic Lab (lifted from EXH-003)",
        exhibit_id: "EXH-006",
      },
      {
        collection_location: "Gemstone Recording Studios",
        exhibit_id: "EXH-007",
        contamination_risk: "LOW",
        available_analyses: [
          {
            analysis_id: "FA-007",
            results: {
              summary:
                "Latent fingerprint development on the ledger page reveals three prints. Two are identified as Lila Skye and the studio manager. The third is a partial thumbprint on the corner of the page that is a confirmed match to the partial print 'Set B' from the lipstick tube (EXH-002).",
              unlocks_new_exhibits: ["EXH-008", "EXH-010", "EXH-011"],
              is_conclusive: true,
            },
            analysis_type: "FINGERPRINT_ANALYSIS",
          },
        ],
        item_description:
          "A ledger from 'Gemstone Recording Studios' showing session bookings. The final entry for Lila Skye, on the night she vanished, is smudged with a dark, oily substance. The entry details a solo vocal recording session scheduled from 10 PM to midnight.",
      },
      {
        collection_location: "Police Impound Lot",
        contamination_risk: "MEDIUM",
        available_analyses: [
          {
            analysis_id: "UV-008",
            results: {
              is_conclusive: true,
              summary:
                "Application of an alternate light source to the trunk's interior reveals a large, diffuse area of fluorescence on the fabric liner, consistent with the use of a strong oxidizing agent like bleach to clean biological stains.",
              unlocks_new_exhibits: ["EXH-009"],
            },
            analysis_type: "UV_SCANNING",
          },
        ],
        exhibit_id: "EXH-008",
        item_description:
          "A 1948 Cadillac Fleetwood sedan. The vehicle's tires are of the 'All-State' brand and exhibit a wear pattern consistent with the cast from the crime scene (EXH-004). The exterior is clean, but the interior has a faint, sharp chemical odor.",
      },
      {
        contamination_risk: "HIGH",
        item_description:
          "A 12x12 inch section of fabric cut from the trunk lining of the Cadillac (EXH-008). The fabric is a dark grey wool blend and feels stiff in the center, where the fluorescence was detected. It carries a strong chemical smell.",
        available_analyses: [
          {
            analysis_id: "DNA-009",
            analysis_type: "DNA_ANALYSIS",
            results: {
              unlocks_new_exhibits: [],
              summary:
                "Despite the apparent cleaning, DNA extraction from deep within the fabric fibers yielded a partial but definitive DNA profile. The profile is a conclusive match to the victim, Lila Skye.",
              is_conclusive: true,
            },
          },
          {
            results: {
              summary:
                "Chemical tests confirm the presence of sodium hypochlorite residue, the active ingredient in bleach. The concentration suggests a significant quantity was used in an attempt to sanitize the area.",
              is_conclusive: true,
              unlocks_new_exhibits: [],
            },
            analysis_id: "CA-009",
            analysis_type: "CHEMICAL_ANALYSIS",
          },
        ],
        exhibit_id: "EXH-009",
        collection_location: "Police Impound Lot (from EXH-008)",
      },
      {
        contamination_risk: "LOW",
        collection_location: "Interrogation Room",
        item_description:
          "A sealed evidence bag containing a buccal (cheek) swab collected from the primary suspect, the associate of the studio manager. The sample was collected under warrant and is ready for comparative DNA analysis.",
        exhibit_id: "EXH-010",
        available_analyses: [
          {
            analysis_id: "DNA-010",
            results: {
              is_conclusive: true,
              unlocks_new_exhibits: [],
              summary:
                "The DNA profile generated from the suspect's buccal swab is a conclusive match to the 'Unknown Male B' profile (EXH-005) recovered from the lipstick tube (EXH-002). The statistical probability of a coincidental match is 1 in 7.8 billion.",
            },
            analysis_type: "DNA_ANALYSIS",
          },
        ],
      },
      {
        item_description:
          "A 7-inch reel-to-reel audio tape recovered from the suspect's residence. The magnetic tape is properly spooled, and there is no visible damage to the tape or the reel. The box is unlabeled, offering no information about its contents.",
        collection_location: "Suspect's Apartment",
        exhibit_id: "EXH-011",
        available_analyses: [
          {
            results: {
              summary:
                "Forensic audio recovery was performed on the magnetic tape. The audio contains the final 15 minutes of Lila Skye's recording session. It captures a heated argument with a male voice, identified as the suspect's, followed by sounds of a physical struggle and the distinct scratching noise of a stylus being dragged across a vinyl record. The tape ends abruptly.",
              is_conclusive: true,
              unlocks_new_exhibits: [],
            },
            analysis_type: "CHEMICAL_ANALYSIS",
            analysis_id: "AUDIO-011",
          },
        ],
        contamination_risk: "LOW",
      },
    ],
    case_name: "The Blue Canary Disappearance",
  },
};

/**
 * Transforms forensic data into a narrative scene structure for the UI.
 */
const generateNarrativeData = (
  data: ForensicStoryData | null
): NarrativeCaseData | null => {
  if (!data) return null;

  const scenes: Scene[] = [];
  const intake_scene_id = "scene_intake";

  // Create a scene for each analysis result
  data.story.exhibits.forEach((exhibit) => {
    exhibit.available_analyses.forEach((analysis) => {
      scenes.push({
        scene_id: `scene_${analysis.analysis_id}`,
        narration: `Analysis results for ${
          exhibit.exhibit_id
        } using ${analysis.analysis_type.replace(/_/g, " ")}.`,
        clues: [
          {
            clue_id: analysis.analysis_id,
            name: `[${exhibit.exhibit_id}] ${analysis.analysis_type.replace(
              /_/g,
              " "
            )}`,
            description: analysis.results.summary,
          },
        ],
        options: [
          {
            option_id: `return_${analysis.analysis_id}`,
            next_scene: intake_scene_id,
            description: "Return to Evidence Locker",
          },
        ],
      });
    });
  });

  // Create the main intake scene (evidence locker)
  const intakeScene: Scene = {
    scene_id: intake_scene_id,
    narration:
      "The initial evidence from Ashworth Manor is logged and ready for processing. Select an exhibit and analysis type to proceed. Your findings will be added to the case file.",
    options: data.story.exhibits.flatMap((exhibit) =>
      exhibit.available_analyses.map((analysis) => ({
        option_id: `${exhibit.exhibit_id}_${analysis.analysis_id}`,
        next_scene: `scene_${analysis.analysis_id}`,
        description: `Analyze ${
          exhibit.exhibit_id
        }: ${analysis.analysis_type.replace(/_/g, " ")}`,
      }))
    ),
    // We will use the 'dialogues' section to list the exhibits
    dialogues: data.story.exhibits.map((exhibit) => ({
      character: exhibit.exhibit_id,
      speech: exhibit.item_description,
    })),
  };
  scenes.push(intakeScene);

  return {
    title: data.story.case_name,
    scenes: scenes,
  };
};

export default function ForensicNoirPage() {
  const [currentScene, setCurrentScene] = useState<string>("scene_intake");
  const [discoveredAnalyses, setDiscoveredAnalyses] = useState<string[]>([]);
  const [forensicData, setForensicData] = useState<ForensicStoryData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_intake"]);
  const router = useRouter();

  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post<ForensicStoryData>(
          "http://localhost:8000/api/forensic-story",
          {
            case: "noir_newyork",
          }
        );
        setForensicData(response.data);
      } catch (error) {
        console.warn("API call failed. Using fallback mock data.", error);
        setForensicData(fallbackData);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    };
    fetchCaseData();
  }, []);

  const caseData = useMemo(
    () => generateNarrativeData(forensicData),
    [forensicData]
  );
  const scene = caseData?.scenes.find((s) => s.scene_id === currentScene);

  const handleOptionClick = (option: Option) => {
    if (scene?.clues) {
      const newClueIds = scene.clues.map((clue) => clue.clue_id);
      setDiscoveredAnalyses((prev) => [...new Set([...prev, ...newClueIds])]);
    }

    setSceneHistory((prev) => [...prev, option.next_scene]);
    setCurrentScene(option.next_scene);
  };

  const handleBackToScene = () => {
    if (sceneHistory.length > 1) {
      const newHistory = [...sceneHistory];
      newHistory.pop();
      const previousScene = newHistory[newHistory.length - 1];
      setSceneHistory(newHistory);
      setCurrentScene(previousScene);
    }
  };

  if (isLoading || !caseData) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Accessing Forensic Archives...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #000000, #1f2937);
            color: #00bfff;
            font-family: "Crimson Text", serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 191, 255, 0.3);
            border-top: 3px solid #00bfff;
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

  if (!scene) {
    return (
      <div className="error-screen">
        <h2>Scene not found</h2>
        <Link href="/">Return to Main Menu</Link>
      </div>
    );
  }

  return (
    <>
      <div className="case-container">
        <div className="noir-overlay"></div>
        <div className="case-header">
          <h1>{caseData.title}</h1>
          <div className="clues-counter">
            Analyses Performed: {discoveredAnalyses.length}
          </div>
        </div>
        <div className="scene-content">
          {sceneHistory.length > 1 && (
            <button className="scene-back-button" onClick={handleBackToScene}>
              ← Previous Step
            </button>
          )}
          <div className="narration-box">
            <h3>🕵️ Forensic Log</h3>
            <p className="narration">{scene.narration}</p>
          </div>
          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3>📦 Evidence Locker</h3>
              {scene.dialogues.map((dialogue, index) => (
                <div key={index} className="dialogue-item">
                  <span className="character-name">{dialogue.character}:</span>
                  <span className="speech">"{dialogue.speech}"</span>
                </div>
              ))}
            </div>
          )}
          {scene.clues && scene.clues.length > 0 && (
            <div className="clues-section">
              <h3>🔬 Analysis Results</h3>
              {scene.clues.map((clue) => (
                <div key={clue.clue_id} className="clue-item">
                  <strong>{clue.name}</strong>
                  <p>{clue.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="options-section">
            <h3>🤔 Select Procedure</h3>
            <div className="options-grid">
              {scene.options.map((option) => (
                <button
                  key={option.option_id}
                  className="option-btn"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.description}
                </button>
              ))}
            </div>
          </div>
        </div>
        {discoveredAnalyses.length > 0 && (
          <div className="evidence-sidebar">
            <h3>📋 Analysis File</h3>
            <div className="evidence-list">
              {discoveredAnalyses.map((clueId, index) => {
                const clue = caseData.scenes
                  .flatMap((s) => s.clues || [])
                  .find((c) => c.clue_id === clueId);
                return clue ? (
                  <div key={index} className="evidence-item">
                    <strong>{clue.name}</strong>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
        <button className="back-button" onClick={() => router.back()}>
          ← Return to Cases
        </button>
      </div>

      <style jsx>{`
        /* All original Noir UI styles are preserved here */
        .case-container {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #0f0f23 0%,
            #1a1a2e 50%,
            #16213e 100%
          );
          color: #e2e8f0;
          font-family: "Crimson Text", serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }
        .noir-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
              ellipse at 20% 50%,
              rgba(0, 191, 255, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 80% 20%,
              rgba(138, 43, 226, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at 40% 80%,
              rgba(0, 255, 255, 0.08) 0%,
              transparent 50%
            );
          pointer-events: none;
          animation: noirDrift 25s ease-in-out infinite;
        }
        @keyframes noirDrift {
          0%,
          100% {
            opacity: 0.4;
            transform: translateX(0px);
          }
          50% {
            opacity: 0.7;
            transform: translateX(15px);
          }
        }
        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(0, 191, 255, 0.15);
          border-radius: 15px;
          border: 2px solid #00bfff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }
        .case-header h1 {
          font-size: 2.8rem;
          margin: 0 0 10px 0;
          color: #00bfff;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          font-weight: 700;
        }
        .clues-counter {
          font-size: 1.2rem;
          color: #00ffff;
          font-weight: 600;
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
          background: rgba(26, 26, 46, 0.8);
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #00bfff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(5px);
        }
        .narration-box h3,
        .dialogue-section h3,
        .clues-section h3,
        .options-section h3 {
          margin: 0 0 18px 0;
          color: #00bfff;
          font-size: 1.4rem;
          font-weight: 600;
        }
        .narration {
          font-size: 1.15rem;
          line-height: 1.7;
          font-style: italic;
          color: #cbd5e0;
        }
        .dialogue-item {
          margin: 12px 0;
          padding: 15px;
          background: rgba(0, 191, 255, 0.2);
          border-radius: 10px;
          border-left: 3px solid #00ffff;
        }
        .character-name {
          font-weight: bold;
          color: #00bfff;
          margin-right: 12px;
          font-size: 1.1rem;
        }
        .speech {
          font-style: italic;
          color: #e2e8f0;
        }
        .clues-section {
          border-left-color: #00ffff;
          background: rgba(0, 255, 255, 0.1);
        }
        .clue-item {
          background: rgba(0, 191, 255, 0.15);
          padding: 18px;
          border-radius: 10px;
          margin: 12px 0;
          border: 2px solid #00ffff;
          box-shadow: 0 2px 10px rgba(0, 255, 255, 0.2);
        }
        .clue-item strong {
          color: #00bfff;
          display: block;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }
        .options-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .option-btn {
          background: linear-gradient(45deg, #00bfff, #8a2be2);
          color: white;
          border: none;
          padding: 18px 24px;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          font-family: "Crimson Text", serif;
          box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
        }
        .option-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 191, 255, 0.4);
          background: linear-gradient(45deg, #00ffff, #9370db);
        }
        .evidence-sidebar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          background: rgba(15, 15, 35, 0.95);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #00ffff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
        }
        .evidence-sidebar h3 {
          color: #00bfff;
          margin: 0 0 18px 0;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
        }
        .evidence-item {
          background: rgba(0, 255, 255, 0.15);
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          font-size: 0.95rem;
          border-left: 3px solid #00ffff;
        }
        .evidence-item strong {
          color: #e2e8f0;
        }
        .back-button {
          position: fixed;
          bottom: 25px;
          left: 25px;
          background-color: transparent;
          border: 2px solid #00bfff;
          color: #00bfff;
          padding: 15px 25px;
          border-radius: 30px;
          font-size: 1.05rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          font-family: "Crimson Text", serif;
          cursor: pointer;
        }
        .back-button:hover {
          background-color: #00bfff;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4);
        }
        .scene-back-button {
          background: rgba(0, 191, 255, 0.1);
          color: #00bfff;
          border: 2px solid #00bfff;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: "Crimson Text", serif;
          margin-bottom: 20px;
          align-self: flex-start;
        }
        .scene-back-button:hover {
          background: #00bfff;
          color: white;
          transform: translateX(3px);
          box-shadow: 0 4px 15px rgba(0, 191, 255, 0.4);
        }
        @media (max-width: 768px) {
          .evidence-sidebar {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            width: 100%;
            margin-top: 25px;
          }
          .case-header h1 {
            font-size: 2.2rem;
          }
          .options-grid {
            grid-template-columns: 1fr;
          }
          .case-container {
            padding: 15px;
          }
        }
      `}</style>
    </>
  );
}
