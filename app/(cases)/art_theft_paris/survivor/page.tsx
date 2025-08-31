"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

// --- Type Definitions for Clarity (Optional but Recommended) ---
interface Insight {
  clue_id: string;
  name: string;
  description: string;
}

interface TransformedMemory {
  scene_id: string;
  narration: string;
  options: {
    description: string;
    next_scene: string;
  }[];
  clues: Insight[];
  dialogues: any[]; // Assuming no dialogues in the new data
}

// --- Fallback Mock Data ---
const fallbackData = {
  story: {
    scenario_name: "Countryside Manor Murder",
    memories: [
      {
        internal_monologue:
          "The polished wood gleams under the dim light, reflecting the horror etched onto my face.  I can still smell the coppery tang of blood, feel the icy grip of fear constricting my chest. Was it the wine? The sudden silence? Or was I always this blind to the simmering resentments beneath the surface of this family? Why did he have to die?",
        trauma_distortion_level: "MEDIUM",
        decisions: [
          {
            description:
              "Tell the police everything you saw, even if it implicates someone you love.",
            next_memory_id: "memory_2",
            decision_id: "decision_1",
            outcome_type: "DANGEROUS_CONFRONTATION",
          },
          {
            next_memory_id: "memory_3",
            description:
              "Keep quiet, protect your family's secrets, and hope the truth never comes out.",
            decision_id: "decision_2",
            outcome_type: "TEMPORARY_SAFETY",
          },
        ],
        emotional_state: "FEAR",
        memory_id: "memory_1",
      },
      {
        internal_monologue:
          "My confession hangs in the air, a fragile thing in the face of their stony silence.  The weight of the truth, the betrayal, threatens to crush me.  I see the flicker of suspicion, the carefully controlled fear in their eyes, but what if I'm wrong? What if this was an accident, and my fear is twisting the truth?",
        memory_id: "memory_2",
        emotional_state: "CONFUSION",
        trauma_distortion_level: "LOW",
        decisions: [
          {
            outcome_type: "DANGEROUS_CONFRONTATION",
            next_memory_id: "memory_4",
            decision_id: "decision_3",
            description:
              "Stand by your confession, demand a full investigation.",
          },
          {
            description: "Recant your statement, claim to have been mistaken.",
            next_memory_id: "memory_5",
            outcome_type: "TEMPORARY_SAFETY",
            decision_id: "decision_4",
          },
        ],
      },
      {
        internal_monologue:
          "The silence is deafening.  A pact of secrecy hangs heavy in the air, a suffocating blanket of guilt and fear.  But what if someone else knows? What if they were watching?  This silence could be my undoing or my salvation. This house is a prison of secrets and lies.",
        trauma_distortion_level: "HIGH",
        emotional_state: "FEAR",
        decisions: [
          {
            next_memory_id: "memory_6",
            decision_id: "decision_5",
            outcome_type: "ESCAPE_ROUTE",
            description:
              "Try to discreetly gather evidence to prove your innocence.",
          },
          {
            description: "Trust in the family’s silence and hope for the best.",
            decision_id: "decision_6",
            next_memory_id: "memory_7",
            outcome_type: "TEMPORARY_SAFETY",
          },
        ],
        memory_id: "memory_3",
      },
      {
        internal_monologue:
          "The police are relentless, their questions cutting through my carefully constructed story. I feel the net closing, the truth threatening to unravel everything.  I hope I am not making a mistake.",
        trauma_distortion_level: "LOW",
        decisions: [
          {
            description: "Continue to cooperate fully with the investigation.",
            outcome_type: "INJURY",
            decision_id: "decision_7",
            next_memory_id: "memory_8",
          },
          {
            description: "Attempt to evade the police and disappear.",
            next_memory_id: "memory_9",
            decision_id: "decision_8",
            outcome_type: "ESCAPE_ROUTE",
          },
        ],
        memory_id: "memory_4",
        emotional_state: "PANIC",
      },
      {
        internal_monologue:
          "The relief is temporary.  The shadow of suspicion still hangs over me.  The silence is a fragile thing, easily broken by a whispered word, a misplaced object. I feel the weight of the secret pressing down on me.",
        decisions: [
          {
            description: "Confess to the police.",
            next_memory_id: "memory_10",
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "decision_9",
          },
          {
            next_memory_id: "memory_11",
            description: "Maintain the lie.",
            outcome_type: "TEMPORARY_SAFETY",
            decision_id: "decision_10",
          },
        ],
        trauma_distortion_level: "MEDIUM",
        emotional_state: "FEAR",
        memory_id: "memory_5",
      },
      {
        memory_id: "memory_6",
        trauma_distortion_level: "LOW",
        emotional_state: "DETERMINATION",
        decisions: [
          {
            outcome_type: "ESCAPE_ROUTE",
            next_memory_id: "memory_12",
            decision_id: "decision_11",
            description: "Successfully gather enough evidence for exoneration",
          },
          {
            outcome_type: "INJURY",
            next_memory_id: "memory_13",
            description: "Evidence gathering fails.",
            decision_id: "decision_12",
          },
        ],
        internal_monologue:
          "My heart pounds in my chest.  I'm playing a dangerous game, one wrong move and it’s all over. But is it worth the risk?",
      },
      {
        emotional_state: "RESIGNATION",
        internal_monologue:
          "The days stretch into weeks, each one a slow drip of tension.  I’m not sure how much longer this uneasy peace can last.",
        trauma_distortion_level: "MEDIUM",
        decisions: [
          {
            outcome_type: "TEMPORARY_SAFETY",
            decision_id: "decision_13",
            next_memory_id: "memory_14",
            description: "Let the investigation run its course.",
          },
          {
            description: "Try to leave the country.",
            outcome_type: "ESCAPE_ROUTE",
            decision_id: "decision_14",
            next_memory_id: "memory_15",
          },
        ],
        memory_id: "memory_7",
      },
      {
        memory_id: "memory_8",
        internal_monologue:
          "The interrogation room is cold, the fluorescent lights harsh against my weary eyes.  The weight of their suspicion bears down on me.  I wish I could undo it all.",
        trauma_distortion_level: "LOW",
        decisions: [],
        emotional_state: "PANIC",
      },
      {
        trauma_distortion_level: "HIGH",
        memory_id: "memory_9",
        emotional_state: "FEAR",
        internal_monologue:
          "I’m running, the wind whipping through my hair, the ground a blur beneath my feet.  But will they catch me?",
        decisions: [],
      },
      {
        trauma_distortion_level: "LOW",
        memory_id: "memory_10",
        emotional_state: "RESIGNATION",
        internal_monologue:
          "My confession hangs heavy in the air, the truth finally spoken.  Now I wait for the consequences. Will I be believed? Will I be punished?",
        decisions: [],
      },
      {
        emotional_state: "FEAR",
        decisions: [],
        trauma_distortion_level: "MEDIUM",
        internal_monologue:
          "The lie festers, a poisonous seed in my heart.  But for how long can I maintain this facade?",
        memory_id: "memory_11",
      },
      {
        memory_id: "memory_12",
        internal_monologue:
          "Exonerated.  The relief washes over me, but the memory of the horror remains. I am free, but haunted.",
        emotional_state: "DETERMINATION",
        trauma_distortion_level: "LOW",
        decisions: [],
      },
      {
        emotional_state: "RESIGNATION",
        decisions: [],
        trauma_distortion_level: "HIGH",
        internal_monologue:
          "The truth has caught up to me.  The consequences are severe. The justice system has spoken.",
        memory_id: "memory_13",
      },
      {
        emotional_state: "FEAR",
        trauma_distortion_level: "MEDIUM",
        decisions: [],
        internal_monologue:
          "The investigation drags on, the uncertainty eating away at me.  Will the truth ever come out?",
        memory_id: "memory_14",
      },
      {
        decisions: [],
        trauma_distortion_level: "HIGH",
        memory_id: "memory_15",
        emotional_state: "FEAR",
        internal_monologue:
          "I’m a fugitive, running from the past, forever looking over my shoulder.  But am I truly free?",
      },
    ],
  },
};

/**
 * Transforms the raw story data into a format the component can use.
 * This function maps 'memories' to 'scenes', 'internal_monologue' to 'narration', etc.
 * It also creatively uses emotional state and trauma level as "clues" or "insights".
 */
const transformApiData = (
  apiData: typeof fallbackData
): TransformedMemory[] => {
  return apiData.story.memories.map((memory) => ({
    scene_id: memory.memory_id,
    narration: memory.internal_monologue,
    options: memory.decisions.map((decision) => ({
      description: decision.description,
      next_scene: decision.next_memory_id,
    })),
    // Repurpose the 'clues' feature to show psychological insights
    clues: [
      {
        clue_id: `${memory.memory_id}-emotion`,
        name: "Emotional State",
        description: memory.emotional_state,
      },
      {
        clue_id: `${memory.memory_id}-trauma`,
        name: "Trauma Distortion",
        description: `Level: ${memory.trauma_distortion_level}`,
      },
    ],
    // Provide an empty array for dialogues to prevent rendering errors
    dialogues: [],
  }));
};

export default function SurvivorPovPage() {
  const router = useRouter();

  // State to hold the transformed story data, loaded from API or fallback
  const [storyData, setStoryData] = useState<TransformedMemory[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storyName, setStoryName] = useState<string>(
    fallbackData.story.scenario_name
  );

  // Core gameplay state
  const [currentMemoryId, setCurrentMemoryId] = useState("memory_1");
  const [discoveredInsights, setDiscoveredInsights] = useState<Insight[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<string[]>(["memory_1"]);

  // --- API Call Simulation ---
  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        // Mocking an API call to a non-existent endpoint to demonstrate the fallback mechanism.
        // In a real app, this would be your actual API endpoint, e.g., '/api/stories/countryside-murder'.
        const response = await axios.post(
          "http://localhost:8000/api/survivor-story",
          {
            case: "art_theft_paris",
          }
        );
        setStoryData(transformApiData(response.data));
        setStoryName(response.data.story.scenario_name);
      } catch (error) {
        console.warn("API call failed. Using fallback mock data.", error);
        // If the API call fails, use the local fallback data.
        setStoryData(transformApiData(fallbackData));
      } finally {
        setIsLoading(false);
      }
    };
    if (!storyData) fetchStoryData();
  }, []); // Empty dependency array ensures this runs only once on component mount.

  const currentMemoryData = storyData?.find(
    (mem) => mem.scene_id === currentMemoryId
  );

  useEffect(() => {
    if (currentMemoryData) {
      setDiscoveredInsights((prev) => {
        const newInsights = currentMemoryData.clues.filter(
          (clue) =>
            !prev.some((existingClue) => existingClue.clue_id === clue.clue_id)
        );
        return [...prev, ...newInsights];
      });
    }
  }, [currentMemoryId, currentMemoryData]);

  const handleOptionClick = (nextMemory: string) => {
    // This outcome is not present in the new data but is kept for structural integrity
    if (nextMemory === "case_solved") {
      alert("This path concludes the story.");
      return;
    }

    // In a real scenario with more memories, you would navigate to the next memory ID.
    // For now, let's show an alert if the next memory doesn't exist in the mock data.
    if (
      !fallbackData.story.memories.some((mem) => mem.memory_id === nextMemory)
    ) {
      alert(
        `Path to memory "${nextMemory}" is not defined in the current data set. This is the end of this branch.`
      );
      return;
    }

    setMemoryHistory((prev) => [...prev, nextMemory]);
    setCurrentMemoryId(nextMemory);
  };

  const handleBackToScene = () => {
    if (memoryHistory.length > 1) {
      const newHistory = [...memoryHistory];
      newHistory.pop();
      const previousMemory = newHistory[newHistory.length - 1];
      setMemoryHistory(newHistory);
      setCurrentMemoryId(previousMemory);
    }
  };

  if (isLoading || !currentMemoryData) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Recalling fragmented memories...</p>
        <style jsx>{`
          /* Your existing loading screen CSS */
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
        <div className="case-header">
          {/* Updated title to reflect the new scenario */}
          <h1>{storyName}</h1>
          <p className="subtitle">A Survivor's Fragmented Memory</p>
          <div className="status-bar">
            <div className="clues-counter">
              {/* Changed "EVIDENCE" to "INSIGHTS" for thematic consistency */}
              <span className="label">INSIGHTS:</span>
              <span className="count">{discoveredInsights.length}</span>
            </div>
            <div className="scene-indicator">
              {/* Changed "SCENE" to "MEMORY" */}
              <span className="label">MEMORY:</span>
              <span className="scene-id">{currentMemoryId.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="scene-content">
          {memoryHistory.length > 1 && (
            <button className="scene-back-button" onClick={handleBackToScene}>
              ← PREVIOUS MEMORY
            </button>
          )}

          <div className="narration-box">
            <div className="section-header">
              <span className="icon">🧠</span>
              {/* Changed title to reflect internal thoughts */}
              <h3>INTERNAL MONOLOGUE</h3>
            </div>
            <p className="narration">{currentMemoryData.narration}</p>
          </div>

          {currentMemoryData.dialogues &&
            currentMemoryData.dialogues.length > 0 && (
              <div className="dialogue-section">
                <div className="section-header">
                  <span className="icon">💬</span>
                  <h3>CONVERSATIONS</h3>
                </div>
                {currentMemoryData.dialogues.map((dialogue, index) => (
                  <div key={index} className="dialogue-item">
                    <div className="character-tag">{dialogue.character}</div>
                    <div className="speech-bubble">"{dialogue.speech}"</div>
                  </div>
                ))}
              </div>
            )}

          {currentMemoryData.clues && currentMemoryData.clues.length > 0 && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon">🔍</span>
                <h3>PSYCHOLOGICAL INSIGHTS</h3>
              </div>
              {currentMemoryData.clues.map((clue, index) => (
                <div key={index} className="clue-item">
                  <div className="clue-header">
                    <strong className="clue-name">
                      {clue.name.toUpperCase()}
                    </strong>
                    <span className="clue-status">OBSERVED</span>
                  </div>
                  <p className="clue-description">{clue.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="options-section">
            <div className="section-header">
              <span className="icon">⚖️</span>
              <h3>WHAT DO YOU DO?</h3>
            </div>
            {currentMemoryData.options &&
            currentMemoryData.options.length > 0 ? (
              <div className="options-grid">
                {currentMemoryData.options.map((option, index) => (
                  <button
                    key={index}
                    className="option-btn"
                    onClick={() => handleOptionClick(option.next_scene)}
                  >
                    <span className="option-text">{option.description}</span>
                    <div className="btn-glow"></div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="solved-icon">🏁</div>
                  <h2>CASE SOLVED</h2>
                  <p>
                    The branch has concluded — there are no further choices.
                  </p>
                </div>
                <div className="solved-actions">
                  <button
                    className="option-btn"
                    onClick={() => alert("You wake from the memory.")}
                  >
                    AWAKEN
                    <div className="btn-glow"></div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {discoveredInsights.length > 0 && (
          <div className="evidence-sidebar">
            <div className="sidebar-header">
              <h3>MEMORY LOG</h3>
              <div className="connection-status">STABLE</div>
            </div>
            <div className="evidence-list">
              {discoveredInsights.map((clue, index) => (
                <div key={index} className="evidence-item">
                  <div className="evidence-icon">📄</div>
                  <div className="evidence-name">{clue.name.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="back-button" onClick={() => router.back()}>
          <span>← AWAKEN</span>
        </button>
      </div>

      <style jsx>{`
        /* --- All of your original, unchanged CSS goes here --- */
        .case-container {
          min-height: 100vh;
          /* Adjusted theme slightly for a more somber/psychological feel */
          background: linear-gradient(135deg, #2c3e50, #34495e, #7f8c8d);
          color: #ecf0f1;
          font-family: serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }

        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(236, 240, 241, 0.1);
          border-radius: 10px;
          border: 2px solid #95a5a6;
          box-shadow: 0 0 20px rgba(189, 195, 199, 0.3);
          backdrop-filter: blur(10px);
        }

        .case-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          color: #ecf0f1;
          text-shadow: 0 0 15px rgba(236, 240, 241, 0.8);
          letter-spacing: 2px;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #bdc3c7;
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
          color: #e74c3c;
          font-weight: bold;
        }

        .count,
        .scene-id {
          color: #ecf0f1;
          background: rgba(189, 195, 199, 0.2);
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
          background: rgba(44, 62, 80, 0.7);
          padding: 25px;
          border-radius: 10px;
          border: 1px solid #7f8c8d;
          box-shadow: 0 0 15px rgba(127, 140, 141, 0.2);
          backdrop-filter: blur(5px);
        }

        /* ... and the rest of your unchanged CSS ... */

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(127, 140, 141, 0.3);
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
          color: #bdc3c7;
          font-style: italic;
        }

        .dialogue-item {
          margin: 15px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .character-tag {
          background: linear-gradient(45deg, #c0392b, #8e44ad);
          color: #fff;
          padding: 4px 12px;
          border-radius: 15px;
          font-weight: bold;
          font-size: 0.9rem;
          align-self: flex-start;
        }

        .speech-bubble {
          background: rgba(142, 68, 173, 0.1);
          padding: 12px 18px;
          border-radius: 10px;
          border-left: 3px solid #8e44ad;
          color: #ecf0f1;
          font-style: italic;
        }

        .clues-section {
          border-color: #f39c12;
          box-shadow: 0 0 15px rgba(243, 156, 18, 0.2);
        }

        .clue-item {
          background: rgba(243, 156, 18, 0.1);
          padding: 18px;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid #f39c12;
        }

        .clue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .clue-name {
          color: #f39c12;
          font-size: 1.1rem;
        }

        .clue-status {
          background: #f39c12;
          color: #000;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .clue-description {
          color: #ecf0f1;
          margin: 0;
          line-height: 1.5;
        }

        .options-grid {
          display: grid;
          gap: 15px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .option-btn {
          background: linear-gradient(45deg, #2980b9, #27ae60);
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
          box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
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

        .evidence-sidebar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          background: rgba(44, 62, 80, 0.9);
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #7f8c8d;
          box-shadow: 0 0 20px rgba(127, 140, 141, 0.3);
          backdrop-filter: blur(10px);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #7f8c8d;
        }

        .sidebar-header h3 {
          color: #ecf0f1;
          margin: 0;
          font-size: 1.1rem;
        }

        .connection-status {
          background: #27ae60;
          color: #fff;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .evidence-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(127, 140, 141, 0.1);
          padding: 10px;
          margin: 8px 0;
          border-radius: 5px;
          font-size: 0.9rem;
        }

        .evidence-icon {
          font-size: 1.1rem;
        }

        .evidence-name {
          color: #bdc3c7;
        }

        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: transparent;
          border: 2px solid #95a5a6;
          color: #95a5a6;
          padding: 15px 25px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: serif;
        }

        .back-button:hover {
          background: #95a5a6;
          color: #2c3e50;
          box-shadow: 0 0 20px rgba(149, 165, 166, 0.5);
          transform: scale(1.05);
        }

        .scene-back-button {
          background: rgba(149, 165, 166, 0.2);
          color: #bdc3c7;
          border: 2px solid #95a5a6;
          padding: 15px 25px;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: serif;
          margin-bottom: 20px;
          align-self: flex-start;
        }

        .scene-back-button:hover {
          background: #95a5a6;
          color: #2c3e50;
          transform: translateX(-5px);
          box-shadow: 0 0 15px rgba(149, 165, 166, 0.4);
        }

        @media (max-width: 768px) {
          .evidence-sidebar {
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            width: 100%;
            margin-top: 20px;
          }

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
