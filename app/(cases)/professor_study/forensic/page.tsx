"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
// Placeholder for icons, assuming a library like lucide-react is used
import {
  BookOpen,
  ChevronLeft,
  Search,
  FileText,
  Users,
  ArrowLeft,
} from "lucide-react";

// --- Type Definitions for Incoming Data ---
interface AnalysisResult {
  summary: string;
  is_conclusive: boolean;
  unlocks_new_exhibits?: string[];
}

interface AvailableAnalysis {
  analysis_id: string;
  analysis_type: string;
  results: AnalysisResult;
}

interface Exhibit {
  exhibit_id: string;
  item_description: string;
  contamination_risk: string;
  collection_location: string;
  available_analyses: AvailableAnalysis[];
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

interface Option {
  option_id: string;
  next_scene: string;
  description: string;
}

interface Scene {
  scene_id: string;
  narration: string;
  options: Option[];
  clues: Clue[];
  dialogues: any[];
  background_audio: string;
}

interface Ending {
  title: string;
  content: string;
}

// --- Fallback Mock Data ---
const fallbackData: ForensicStoryData = {
  story: {
    exhibits: [
      {
        collection_location: "Living room coffee table, next to victim's body.",
        item_description:
          "A 500mL glass beaker containing a clear, colorless liquid. The exterior of the beaker is free of labels and has a slight residue near the rim. The liquid has a pH of 7.0 and is at room temperature (21°C).",
        exhibit_id: "EXH-001",
        contamination_risk: "LOW",
        available_analyses: [
          {
            analysis_id: "EXH-001-A1",
            analysis_type: "CHEMICAL_ANALYSIS",
            results: {
              summary:
                "Gas Chromatography-Mass Spectrometry (GC-MS) analysis reveals the liquid is deionized water with trace amounts of sodium chloride. No volatile organic compounds, toxins, or pharmaceutical agents were detected.",
              is_conclusive: true,
            },
          },
          {
            analysis_id: "EXH-001-A2",
            analysis_type: "FINGERPRINT_ANALYSIS",
            results: {
              is_conclusive: true,
              unlocks_new_exhibits: ["EXH-006", "EXH-007"],
              summary:
                "Cyanoacrylate fuming of the beaker's exterior surface reveals two sets of latent fingerprints. One full print on the body of the beaker and a partial print on the rim. Both are suitable for comparison.",
            },
          },
        ],
      },
      {
        available_analyses: [
          {
            analysis_id: "EXH-002-A1",
            analysis_type: "CHEMICAL_ANALYSIS",
            results: {
              unlocks_new_exhibits: ["EXH-008"],
              summary:
                "Toxicological analysis of five randomly selected tablets confirms they are Amitriptyline at the correct dosage (50mg). No adulterants or other substances were initially detected via standard screening panels.",
              is_conclusive: true,
            },
          },
          {
            results: {
              summary:
                "Multiple latent fingerprints were lifted from the bottle's surface and cap. Three prints match the victim's known records. One unidentified partial print was also recovered from the main body of the bottle.",
              is_conclusive: true,
              unlocks_new_exhibits: ["EXH-009"],
            },
            analysis_id: "EXH-002-A2",
            analysis_type: "FINGERPRINT_ANALYSIS",
          },
        ],
        item_description:
          "A standard prescription bottle for 'Amitriptyline', prescribed to the victim, Dr. Alistair Finch. The bottle originally contained 90 tablets of 50mg each. The label indicates the prescription was filled two days prior. Approximately 15-20 tablets remain in the bottle.",
        exhibit_id: "EXH-002",
        contamination_risk: "LOW",
        collection_location:
          "Victim's study, on the desk next to the computer.",
      },
      {
        item_description:
          "A single sheet of 8.5x11 inch, 20-pound weight white office paper. The page contains a single paragraph of typed text with no signature. The text expresses feelings of despair and says 'goodbye'. The paper has a watermark from the 'Mid-Valley Paper Co.' and exhibits a slight, uniform crease down the center.",
        contamination_risk: "MEDIUM",
        collection_location:
          "Victim's study, placed neatly on the center of the desk.",
        available_analyses: [
          {
            results: {
              is_conclusive: true,
              summary:
                "Analysis of the ink using thin-layer chromatography indicates its chemical composition is consistent with the toner used in the victim's office printer (a 'LaserJet Pro M404n'). Analysis of the paper fibers confirms a match to the paper stock found in the same printer's tray.",
            },
            analysis_type: "CHEMICAL_ANALYSIS",
            analysis_id: "EXH-003-A1",
          },
          {
            analysis_id: "EXH-003-A2",
            results: {
              summary:
                "Ninhydrin processing failed to develop any usable friction ridge detail. The paper's surface shows evidence of smudging, rendering any latent prints indecipherable.",
              is_conclusive: false,
            },
            analysis_type: "FINGERPRINT_ANALYSIS",
          },
        ],
        exhibit_id: "EXH-003",
      },
      {
        collection_location: "Victim's study, on the desk.",
        available_analyses: [
          {
            analysis_id: "EXH-004-A1",
            analysis_type: "DNA_ANALYSIS",
            results: {
              is_conclusive: true,
              summary:
                "Swabs taken from the keyboard and trackpad show a primary DNA profile matching the victim. A secondary, low-level trace DNA profile from an unknown male contributor was also detected on the 'Enter' key and spacebar.",
              unlocks_new_exhibits: ["EXH-012"],
            },
          },
          {
            results: {
              is_conclusive: true,
              summary:
                "Fingerprint analysis of the laptop's chassis and screen reveals numerous prints matching the victim. No other viable prints were recovered.",
            },
            analysis_type: "FINGERPRINT_ANALYSIS",
            analysis_id: "EXH-004-A2",
          },
        ],
        exhibit_id: "EXH-004",
        item_description:
          "The victim's personal laptop computer, a 15-inch silver model. The device was found open on the desk, powered on, and displaying the typed note document. The keyboard and trackpad show signs of recent use, but no visible damage or residue.",
        contamination_risk: "LOW",
      },
      {
        available_analyses: [
          {
            results: {
              summary:
                "Toxicology report confirms the presence of Amitriptyline at a concentration of 2.5 mg/L, a level considered to be fatal. Additionally, Zopiclone, a sedative not prescribed to the victim, was detected at a therapeutic level of 0.1 mg/L. The victim's blood alcohol content was 0.0%.",
              is_conclusive: true,
              unlocks_new_exhibits: ["EXH-008"],
            },
            analysis_id: "EXH-005-A1",
            analysis_type: "CHEMICAL_ANALYSIS",
          },
        ],
        item_description:
          "A post-mortem blood sample collected from the victim during autopsy. The sample is a 10mL vial of whole blood, properly preserved and stored under refrigeration.",
        contamination_risk: "LOW",
        exhibit_id: "EXH-005",
        collection_location: "County Morgue, post-autopsy.",
      },
      {
        available_analyses: [
          {
            analysis_id: "EXH-006-A1",
            analysis_type: "FINGERPRINT_ANALYSIS",
            results: {
              is_conclusive: true,
              summary:
                "AFIS database search returns a positive match to the victim, Dr. Alistair Finch. This indicates the victim handled the glass of water.",
            },
          },
        ],
        contamination_risk: "LOW",
        item_description:
          "A digitally lifted and enhanced image of a full latent fingerprint recovered from the glass beaker (EXH-001). The print is of high quality, showing clear ridge details including a central whorl pattern.",
        exhibit_id: "EXH-006",
        collection_location: "Forensics Lab (Originated from EXH-001)",
      },
      {
        collection_location: "Forensics Lab (Originated from EXH-001)",
        contamination_risk: "LOW",
        item_description:
          "A digitally lifted and enhanced image of a partial latent fingerprint recovered from the rim of the glass beaker (EXH-001). The print consists of the upper portion of a fingertip but contains at least 12 unique minutiae.",
        exhibit_id: "EXH-007",
        available_analyses: [
          {
            analysis_type: "FINGERPRINT_ANALYSIS",
            analysis_id: "EXH-007-A1",
            results: {
              is_conclusive: false,
              unlocks_new_exhibits: ["EXH-013"],
              summary:
                "AFIS database search yields no match to known individuals, including the victim. The print is logged as 'Unknown Print #1' for future comparison.",
            },
          },
        ],
      },
      {
        item_description:
          "A second set of five tablets randomly selected from the prescription bottle (EXH-002) for advanced analysis, prompted by the toxicology report from EXH-005.",
        exhibit_id: "EXH-008",
        collection_location: "Forensics Lab (Originated from EXH-002)",
        contamination_risk: "LOW",
        available_analyses: [
          {
            analysis_id: "EXH-008-A1",
            analysis_type: "CHEMICAL_ANALYSIS",
            results: {
              summary:
                "Advanced analysis using liquid chromatography-tandem mass spectrometry (LC-MS/MS) reveals the tablets have been adulterated. Each pill has a fine coating of Zopiclone powder, approximately 7.5mg per tablet, bonded to the exterior with a soluble acacia gum agent.",
              is_conclusive: true,
              unlocks_new_exhibits: ["EXH-010"],
            },
          },
        ],
      },
      {
        collection_location: "Forensics Lab (Originated from EXH-002)",
        exhibit_id: "EXH-009",
        contamination_risk: "LOW",
        available_analyses: [
          {
            results: {
              is_conclusive: true,
              summary:
                "Comparison shows that this partial print shares 10 points of identification with 'Unknown Print #1' from the beaker (EXH-007). The probability of two different individuals sharing this many points is statistically negligible. The prints are determined to be from the same unidentified source.",
              unlocks_new_exhibits: ["EXH-013"],
            },
            analysis_id: "EXH-009-A1",
            analysis_type: "FINGERPRINT_ANALYSIS",
          },
        ],
        item_description:
          "A digitally lifted and enhanced image of the unidentified partial fingerprint recovered from the prescription bottle (EXH-002).",
      },
      {
        exhibit_id: "EXH-010",
        collection_location: "Digital Forensics Lab (Originated from EXH-004)",
        available_analyses: [
          {
            results: {
              unlocks_new_exhibits: ["EXH-011"],
              is_conclusive: true,
              summary:
                "Digital timeline reconstruction based on file system metadata (MAC times) and browser logs. The victim's last self-authored email was sent at 9:32 PM. The typed note document was created at 10:15 PM and last saved at 10:17 PM. Between 9:45 PM and 10:12 PM, the web browser was used to access academic journals, consistent with the victim's normal behavior. However, the typing cadence and error rate of the note's creation are inconsistent with the victim's previously authored documents, showing a slower, more deliberate input method.",
            },
            analysis_id: "EXH-010-A1",
            analysis_type: "UV_SCANNING",
          },
        ],
        item_description:
          "A forensic image of the hard drive from the victim's laptop (EXH-004), created to allow for analysis without altering the original evidence.",
        contamination_risk: "LOW",
      },
      {
        item_description:
          "A deeper forensic analysis of the laptop's hard drive image (EXH-010), focusing on deleted files and network activity logs, prompted by inconsistencies in the digital timeline.",
        contamination_risk: "LOW",
        exhibit_id: "EXH-011",
        available_analyses: [
          {
            results: {
              is_conclusive: true,
              summary:
                "Recovery of deleted email fragments from unallocated disk space reveals several threatening messages sent from a burner email address. The emails reference a failing grade and accuse the professor of 'ruining a future'. Network logs show a brief, unauthorized remote desktop connection to the laptop at 10:14 PM, originating from an IP address on the university's student WiFi network. The connection lasted three minutes.",
            },
            analysis_type: "UV_SCANNING",
            analysis_id: "EXH-011-A1",
          },
        ],
        collection_location: "Digital Forensics Lab (Originated from EXH-010)",
      },
      {
        item_description:
          "The extracted and isolated trace DNA profile of the unknown male contributor found on the victim's keyboard (EXH-004).",
        collection_location: "Genetics Lab (Originated from EXH-004)",
        exhibit_id: "EXH-012",
        contamination_risk: "LOW",
        available_analyses: [
          {
            results: {
              is_conclusive: false,
              summary:
                "The DNA profile is uploaded to the national DNA database, but no match is found. The profile is held for future comparison.",
              unlocks_new_exhibits: ["EXH-014"],
            },
            analysis_type: "DNA_ANALYSIS",
            analysis_id: "EXH-012-A1",
          },
        ],
      },
      {
        collection_location: "Police Headquarters",
        available_analyses: [
          {
            analysis_id: "EXH-013-A1",
            results: {
              is_conclusive: true,
              summary:
                "Direct comparison confirms a perfect match. The student's fingerprints are identical to the unidentified prints recovered from the beaker (EXH-007) and the prescription bottle (EXH-009).",
            },
            analysis_type: "FINGERPRINT_ANALYSIS",
          },
        ],
        contamination_risk: "LOW",
        item_description:
          "A reference set of fingerprints collected from a graduate student who had a public dispute with the victim over a failing grade. The student was identified through university records as being logged into the student WiFi network at the time of the remote connection.",
        exhibit_id: "EXH-013",
      },
      {
        collection_location: "Police Headquarters",
        contamination_risk: "LOW",
        item_description:
          "A reference DNA sample (buccal swab) collected from the graduate student identified via fingerprint match.",
        exhibit_id: "EXH-014",
        available_analyses: [
          {
            analysis_type: "DNA_ANALYSIS",
            analysis_id: "EXH-014-A1",
            results: {
              is_conclusive: true,
              summary:
                "The student's DNA profile is a conclusive match to the unknown trace DNA profile recovered from the victim's keyboard (EXH-012).",
            },
          },
        ],
      },
      {
        item_description:
          "Final case summary based on the synthesis of all forensic findings.",
        collection_location: "Case File",
        available_analyses: [
          {
            results: {
              summary:
                "The scientific evidence provides a conclusive reconstruction of events. The suspect adulterated the victim's medication with a sedative, handled the victim's water glass, and was physically present at the computer keyboard. After the victim was incapacitated by the drugs, the suspect used a remote connection to type the suicide note on the victim's computer. The death is scientifically classified as a homicide by poisoning, staged to appear as a suicide.",
              is_conclusive: true,
            },
            analysis_type: "UV_SCANNING",
            analysis_id: "EXH-015-A1",
          },
        ],
        exhibit_id: "EXH-015",
        contamination_risk: "LOW",
      },
    ],
    case_name: "Case File 2024-04-A71: The Silent Professor",
  },
};

const endings: Record<string, Ending> = {
  ending_homicide: {
    title: "Case Closed: Homicide by Poisoning",
    content:
      "The synthesis of all forensic findings provides a conclusive reconstruction of events. The suspect, a disgruntled graduate student, adulterated the victim's medication with a sedative (Zopiclone), handled the victim's water glass, and was physically present at the computer keyboard. After the victim was incapacitated, the suspect used a brief, unauthorized remote connection to type the suicide note on the victim's computer, staging the scene. The death is scientifically classified as a homicide, and a warrant has been issued for the student's arrest.",
  },
};

/**
 * Transforms forensic data into a narrative scene structure for the UI.
 */
const generateSceneData = (
  data: ForensicStoryData | null,
  discoveredExhibits: string[]
): Scene[] => {
  if (!data) return [];

  const hubSceneId = "scene_hub";
  const scenes: Scene[] = [];

  // Create a scene for each analysis result
  data.story.exhibits.forEach((exhibit) => {
    exhibit.available_analyses.forEach((analysis) => {
      scenes.push({
        scene_id: `scene_${analysis.analysis_id}`,
        narration: `Analysis of ${
          exhibit.exhibit_id
        } (${analysis.analysis_type.replace(/_/g, " ")}) is complete.`,
        clues: [
          {
            clue_id: analysis.analysis_id,
            name: `[${exhibit.exhibit_id}] ${analysis.analysis_type}`,
            description: analysis.results.summary,
          },
        ],
        options: [
          {
            option_id: `return_${analysis.analysis_id}`,
            next_scene: hubSceneId,
            description: "Return to Evidence Locker",
          },
        ],
        dialogues: [],
        background_audio: "lab_analysis",
      });
    });
  });

  // Create the main hub scene (Evidence Locker)
  const hubScene: Scene = {
    scene_id: hubSceneId,
    narration:
      "The evidence from the scene is cataloged and awaiting analysis. Review the available exhibits and select a forensic procedure to continue the investigation. New evidence will become available as you make discoveries.",
    clues: [],
    dialogues: [],
    background_audio: "evidence_locker",
    options: data.story.exhibits
      .filter((exhibit) => discoveredExhibits.includes(exhibit.exhibit_id))
      .flatMap((exhibit) =>
        exhibit.available_analyses.map((analysis) => {
          const isFinalAnalysis = exhibit.exhibit_id === "EXH-015";
          return {
            option_id: `${exhibit.exhibit_id}_${analysis.analysis_id}`,
            next_scene: isFinalAnalysis
              ? "ending_homicide"
              : `scene_${analysis.analysis_id}`,
            description: `${
              isFinalAnalysis
                ? "Synthesize Findings & Close Case"
                : `Analyze ${
                    exhibit.exhibit_id
                  }: ${analysis.analysis_type.replace(/_/g, " ")}`
            }`,
          };
        })
      ),
  };
  scenes.push(hubScene);

  return scenes;
};

export default function ForensicCaseFilePage() {
  const router = useRouter();
  const [forensicData, setForensicData] = useState<ForensicStoryData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentScene, setCurrentScene] = useState<string>("scene_hub");
  const [discoveredAnalyses, setDiscoveredAnalyses] = useState<Clue[]>([]);
  const [discoveredExhibits, setDiscoveredExhibits] = useState<string[]>([]);
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_hub"]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [ending, setEnding] = useState<string>("");

  useEffect(() => {
    const fetchStoryData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post<ForensicStoryData>(
          "http://localhost:8000/api/forensic-story",
          {
            case: "professor_study",
          }
        );
        setForensicData(response.data);
        // Initialize with starting exhibits
        setDiscoveredExhibits([
          "EXH-001",
          "EXH-002",
          "EXH-003",
          "EXH-004",
          "EXH-005",
        ]);
      } catch (error) {
        console.warn("API call failed. Using fallback data.", error);
        setForensicData(fallbackData);
        setDiscoveredExhibits([
          "EXH-001",
          "EXH-002",
          "EXH-003",
          "EXH-004",
          "EXH-005",
        ]);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    };
    if (!forensicData) fetchStoryData();
  }, []);

  const sceneData = useMemo(
    () => generateSceneData(forensicData, discoveredExhibits),
    [forensicData, discoveredExhibits]
  );

  const handleOptionClick = (option: Option) => {
    if (option.next_scene.startsWith("ending_")) {
      setGameEnded(true);
      setEnding(option.next_scene);
      return;
    }

    const analysisId = option.next_scene.replace("scene_", "");
    const sourceExhibit = forensicData?.story.exhibits.find((ex) =>
      ex.available_analyses.some((an) => an.analysis_id === analysisId)
    );
    const analysis = sourceExhibit?.available_analyses.find(
      (an) => an.analysis_id === analysisId
    );

    if (analysis?.results.unlocks_new_exhibits) {
      setDiscoveredExhibits((prev) => [
        ...new Set([...prev, ...analysis!.results.unlocks_new_exhibits!]),
      ]);
    }

    // Add analysis to discovered list
    const clue = {
      clue_id: analysisId,
      name: `[${sourceExhibit?.exhibit_id}] ${analysis?.analysis_type}`,
      description: analysis?.results.summary || "",
    };
    if (!discoveredAnalyses.some((c) => c.clue_id === clue.clue_id)) {
      setDiscoveredAnalyses((prev) => [...prev, clue]);
    }

    setCurrentScene(option.next_scene);
    setSceneHistory((prev) => [...prev, option.next_scene]);
  };

  const handleBackClick = () => {
    if (sceneHistory.length > 1) {
      const newHistory = sceneHistory.slice(0, -1);
      const previousScene = newHistory[newHistory.length - 1];
      setSceneHistory(newHistory);
      setCurrentScene(previousScene);
    }
  };

  const currentSceneData = sceneData.find(
    (scene) => scene.scene_id === currentScene
  );

  if (gameEnded && ending) {
    const endingData = endings[ending];
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #3b0764 100%)",
          color: "#fef3c7",
          padding: "20px",
        }}
      >
        <div
          className="narration-box"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-serif text-amber-200">Case Closed</h1>
          </div>
          <h2 className="text-2xl font-serif text-amber-300 mb-4">
            {endingData.title}
          </h2>
          <p className="text-lg leading-relaxed text-amber-100 mb-8">
            {endingData.content}
          </p>
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push("/")}
              className="option-button flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Cases
            </button>
            <div className="text-amber-300">
              <span className="text-sm">
                Analyses Performed: {discoveredAnalyses.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !currentSceneData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #3b0764 100%)",
          color: "#fef3c7",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-serif">Loading case files...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/forensic-lab.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fef3c7",
        padding: "20px",
      }}
    >
      {sceneHistory.length > 1 && (
        <div className="fixed top-6 left-6 z-50">
          <button onClick={handleBackClick} className="previous-scene-button">
            <ChevronLeft className="w-4 h-4" />
            Previous Step
          </button>
        </div>
      )}

      <div className="scene-content">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-serif text-amber-200">
              {forensicData?.story.case_name}
            </h1>
          </div>
          <div className="scene-counter">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-200">
              Exhibits: {discoveredExhibits.length}/
              {forensicData?.story.exhibits.length}
            </span>
          </div>
        </div>

        <div className="narration-box">
          <h2 className="text-xl font-serif text-amber-300 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {currentScene === "scene_hub" ? "Case Briefing" : "Analysis Report"}
          </h2>
          <p className="text-amber-100 leading-relaxed text-lg font-serif">
            {currentSceneData.narration}
          </p>
        </div>

        <div className="options-section">
          <h3 className="text-lg font-serif text-amber-300 mb-4">
            Available Procedures:
          </h3>
          <div className="options-grid">
            {currentSceneData.options.map((option) => (
              <button
                key={option.option_id}
                onClick={() => handleOptionClick(option)}
                className="option-button"
                disabled={discoveredAnalyses.some(
                  (c) => c.clue_id === option.option_id.split("_").pop()
                )}
              >
                {option.description}
              </button>
            ))}
            {currentSceneData.options.length === 0 && (
              <p className="text-amber-200 italic">
                No further procedures available from this step.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="evidence-sidebar">
        <div className="sidebar-header">
          <h3 className="text-lg font-serif text-amber-300 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Completed Analyses
          </h3>
        </div>
        <div className="clues-list">
          {discoveredAnalyses.map((clue) => (
            <div key={clue.clue_id} className="clue-item">
              <div className="clue-name">{clue.name}</div>
              <div className="text-xs text-amber-200 mt-1">
                {clue.description}
              </div>
            </div>
          ))}
          {discoveredAnalyses.length === 0 && (
            <div className="text-amber-400 text-sm italic">
              No analyses completed yet...
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 left-6">
        <button onClick={() => router.back()} className="return-button">
          <ArrowLeft className="w-4 h-4" />
          Return to Cases
        </button>
      </div>

      <style jsx>{`
        .scene-content {
          max-width: 900px;
          margin: 0 auto;
          padding-right: 320px;
        }
        .narration-box,
        .dialogue-section,
        .options-section {
          background: rgba(55, 30, 82, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .options-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        .option-button {
          text-align: left;
          padding: 24px;
          background: linear-gradient(
            135deg,
            rgba(107, 33, 168, 0.8) 0%,
            rgba(139, 92, 246, 0.8) 100%
          );
          border: 1px solid rgba(192, 132, 252, 0.4);
          border-radius: 8px;
          color: #fef3c7;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          min-height: 80px;
          display: flex;
          align-items: center;
          line-height: 1.5;
        }
        .option-button:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            rgba(126, 34, 206, 0.9) 0%,
            rgba(167, 139, 250, 0.9) 100%
          );
          border-color: rgba(192, 132, 252, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
        }
        .option-button:disabled {
          background: rgba(55, 30, 82, 0.5);
          color: #a78bfa;
          cursor: not-allowed;
          border-color: rgba(139, 92, 246, 0.2);
          opacity: 0.6;
        }
        .evidence-sidebar {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 300px;
          height: calc(100vh - 40px);
          background: rgba(46, 16, 101, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          padding: 24px;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .clues-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .clue-item {
          background: rgba(88, 28, 135, 0.5);
          border: 1px solid rgba(192, 132, 252, 0.2);
          border-radius: 8px;
          padding: 12px;
        }
        .clue-name {
          color: #ddd6fe;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .previous-scene-button,
        .return-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(88, 28, 135, 0.7);
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 8px;
          color: #fef3c7;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .previous-scene-button:hover,
        .return-button:hover {
          background: rgba(107, 33, 168, 0.9);
          border-color: rgba(192, 132, 252, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
        }
        .scene-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(55, 30, 82, 0.6);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
