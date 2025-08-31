"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// --- Type Definitions ---
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
  required_clues?: string[];
}

interface Scene {
  scene_id: string;
  narration: string;
  options: Option[];
  clues?: Clue[];
  dialogues?: Dialogue[];
  background_audio: string;
}

interface StoryData {
  story: {
    title: string;
    scenes: Scene[];
  };
}

// --- Fallback Mock Data ---
const fallbackData: StoryData = {
  story: {
    title: "The Serpent's Song",
    scenes: [
      {
        dialogues: [
          {
            speech:
              "She's a ghost, detective. Vanished right after her last set. Place is clean, too clean. Looks like the owner, Marcus Thorne, is already trying to sweep it under the rug.",
            character: "Officer Miller",
          },
        ],
        scene_id: "scene_1",
        background_audio: "crime_scene",
        narration:
          "The Velvet Serpent nightclub is a tomb tonight. The usual cacophony of jazz and laughter is replaced by a heavy silence, punctuated only by the flash of police cameras. Famous jazz singer Lila 'Lady Blue' Monroe is missing. An overturned microphone stand and a single, wilting white rose on the stage are the only signs that anything is amiss. The air, thick with the scent of stale bourbon and expensive perfume, hangs like a shroud. This isn't just a missing person case; it's a discordant note in the city's grand symphony.",
        options: [
          {
            next_scene: "scene_2",
            option_id: "1A",
            description: "Head to Lila's dressing room.",
          },
          {
            next_scene: "scene_4",
            description: "Question Marcus Thorne, the club owner.",
            option_id: "1B",
          },
          {
            option_id: "1C",
            description: "Talk to the pianist, Sammy 'Fingers' Gallo.",
            next_scene: "scene_3",
          },
        ],
      },
      {
        narration:
          "Lila's dressing room is a chaotic tableau of her frantic departure. A bottle of French perfume lies shattered on the floor, its sweet scent mingling with something acrid, like fear. A silk robe is draped over a chair, and a lipstick-stained glass sits on the vanity, its contents untouched. Half-open drawers reveal a life hastily packed, or perhaps, ruthlessly searched. Near the broken mirror, something glints under the harsh electric light, almost lost in the plush carpet.",
        background_audio: "mystery",
        clues: [
          {
            description:
              "A small, silver locket engraved with a coiled serpent. Inside is a tiny, folded piece of sheet music with an unusual melody.",
            clue_id: "locket",
            name: "Serpent Locket",
          },
        ],
        options: [
          {
            next_scene: "scene_3",
            description: "Examine the glinting object on the floor.",
            option_id: "2A",
          },
          {
            next_scene: "scene_4",
            description:
              "Search the rest of the room for anything else out of place.",
            option_id: "2B",
          },
        ],
        scene_id: "scene_2",
      },
      {
        scene_id: "scene_3",
        background_audio: "rain",
        clues: [
          {
            description:
              "A one-way train ticket to Chicago, dated for the morning after Lila's disappearance. It was torn in half.",
            name: "Torn Train Ticket",
            clue_id: "ticket",
          },
        ],
        dialogues: [
          {
            speech:
              "Lila... she was scared, detective. Real scared. Said Thorne was a snake, that she had to get out. She made a special recording last week, a 'failsafe' she called it. She told me if anything happened to her, I should listen to 'The Serpent's Lullaby'. He found out she was leaving... I just know it.",
            character: "Sammy 'Fingers' Gallo",
          },
        ],
        narration:
          "You find Sammy Gallo in the rain-slicked alley behind the club, his cigarette a lonely ember in the gloom. His usual swagger is gone, replaced by a tremor in his hands that has nothing to do with the cold. He nurses a glass of cheap whiskey, his eyes darting towards the club's back door as if expecting a ghost. He confesses Lila was planning to leave the city, and in her haste, she threw some things away, things he later retrieved from the trash.",
        options: [
          {
            next_scene: "scene_5",
            description: "Head to the recording studio Sammy mentioned.",
            option_id: "3A",
          },
          {
            next_scene: "scene_4",
            option_id: "3B",
            description: "Go back and confront Thorne with this information.",
          },
        ],
      },
      {
        options: [
          {
            next_scene: "scene_7",
            option_id: "4A",
            description: "Press him about his relationship with Lila.",
          },
          {
            option_id: "4B",
            next_scene: "scene_3",
            description:
              "Leave and find a more cooperative source, like the pianist.",
          },
        ],
        scene_id: "scene_4",
        narration:
          "Marcus Thorne's office is a shrine to his own success, all polished mahogany and green leather. He sits behind a desk large enough to land a plane on, a portrait of himself looming over his shoulder. He's a man wrapped in a veneer of charm, but his eyes are as cold and hard as the diamonds on his fingers. He pours you a drink, his movements slow and deliberate, a predator at ease in his own hunting ground. He dismisses your questions with a wave of his hand, acting more annoyed than concerned.",
        background_audio: "fireplace",
        dialogues: [
          {
            speech:
              "Detective, Lila is an artist. Artists are temperamental. She was brilliant, but volatile. She probably just ran off with some musician for a few days. She'll be back when her money or her inspiration runs out. A disappearance? Please. It's just a flair for the dramatic.",
            character: "Marcus Thorne",
          },
        ],
      },
      {
        narration:
          "The recording studio is a forgotten place, smelling of dust and old dreams. Reels of tape line the walls like a library of lost voices. You find the master tape for 'The Serpent's Lullaby' tucked away on a forgotten shelf. The song itself is haunting, a beautiful and tragic melody. But as you listen closely, you hear it—a whispered message mixed faintly beneath the piano track, a secret message left behind by a singer who knew she was running out of time.",
        clues: [
          {
            name: "Coded Recording",
            description:
              "A master tape of a song called 'The Serpent's Lullaby'. Between the haunting verses, Lila's voice, barely a whisper, speaks a coded message: 'The Serpent's nest is in his office. The key is in his ledger. He sells more than songs.'",
            clue_id: "recording",
          },
        ],
        scene_id: "scene_5",
        options: [
          {
            next_scene: "scene_6",
            option_id: "5A",
            description: "Go to Thorne's office to find this 'ledger'.",
          },
          {
            description:
              "Find Lila's main rival, Eleanor Vance, for information.",
            option_id: "5B",
            next_scene: "scene_7",
          },
        ],
        background_audio: "mystery",
      },
      {
        background_audio: "tension",
        clues: [
          {
            description:
              "Thorne's secret accounting ledger, detailing a smuggling operation run out of the nightclub's cellar. Lila's name is on the last page next to a large payment marked 'SILENCE'.",
            name: "Smuggling Ledger",
            clue_id: "ledger",
          },
        ],
        scene_id: "scene_6",
        options: [
          {
            description: "Wait for Thorne and confront him with the evidence.",
            next_scene: "scene_8",
            required_clues: ["recording"],
            option_id: "6A",
          },
          {
            next_scene: "scene_7",
            option_id: "6B",
            description:
              "Leave the ledger and continue investigating other leads.",
          },
        ],
        narration:
          "Armed with the knowledge from the recording, you return to The Velvet Serpent after hours, letting yourself into Thorne's office with a skeleton key. The room is still and silent, the lingering scent of Thorne's cigar the only sign of his presence. You know what you're looking for. Behind the large portrait of himself, you find a hidden wall safe. Inside, beneath stacks of cash, is a small, black ledger. The coded entries are a mystery, but the numbers and names tell a clear story of a criminal enterprise.",
      },
      {
        background_audio: "fireplace",
        scene_id: "scene_7",
        options: [
          {
            next_scene: "scene_6",
            description: "This is a dead end. Return focus to Thorne.",
            option_id: "7A",
          },
          {
            description:
              "Press Eleanor. Maybe she's more involved than she lets on.",
            option_id: "7B",
            next_scene: "scene_9_dead_end",
          },
        ],
        narration:
          "You find Eleanor Vance, Lila's longtime rival, performing at a smoky downtown club. Her voice is powerful, but lacks the soul that made Lila a star. Backstage, she's cold and calculating, making no secret of her jealousy. She hints that Lila's troubles were of her own making, a result of meddling in Marcus Thorne's affairs. She paints a picture of Lila as a naive fool who got in too deep, a narrative that sounds plausible, yet conveniently benefits her own career. Pursuing this lead could take time you don't have.",
        dialogues: [
          {
            character: "Eleanor Vance",
            speech:
              "Lila? Darling, she had it all and she threw it away. She got mixed up with Thorne's business, saw something she shouldn't have. I told her to keep her pretty mouth shut, but she was always a crusader. Her disappearance is a tragedy, of course, but it does open up the headline spot, doesn't it?",
          },
        ],
      },
      {
        scene_id: "scene_8",
        options: [
          {
            next_scene: "scene_9",
            description: "Disarm him before he can fire.",
            option_id: "8A",
          },
          {
            option_id: "8B",
            next_scene: "scene_9_dead_end",
            description: "Try to de-escalate and reason with him.",
          },
        ],
        dialogues: [
          {
            speech:
              "That ledger... she was going to ruin everything. I built this place from nothing! I couldn't let her, don't you see? She's not dead. Just... retired. I gave her a permanent engagement in a place where she can't sing to anyone but the rats. And you, detective, you're about to join her act.",
            character: "Marcus Thorne",
          },
        ],
        narration:
          "Thorne returns to his office to find you waiting, the ledger open on his desk. The mask of civility shatters, revealing the venomous serpent beneath. His eyes burn with fury as he sees his empire exposed. He confesses, not with remorse, but with rage. He admits that Lila discovered his smuggling ring and planned to go to the police. He couldn't let that happen. In one swift movement, he reaches into his desk drawer, his hand emerging not with a pen, but with the cold, hard steel of a revolver.",
        background_audio: "tension",
      },
      {
        options: [
          {
            next_scene: "scene_10_good_ending",
            description: "Radio for backup and rescue Lila.",
            option_id: "9A",
          },
        ],
        background_audio: "crime_scene",
        narration:
          "You move fast, knocking the gun from Thorne's hand before he can aim. The weapon clatters across the polished floor. Defeated and exposed, Thorne's rage collapses into a pathetic whimper. He tells you everything. Lila is alive, locked in the sound-proofed wine cellar beneath the club, a makeshift prison from which her songs could never escape. He was planning to move her, to make her disappear for good once the heat died down. Now, the only place he's going is upstate.",
        scene_id: "scene_9",
      },
      {
        narration:
          "You wasted too much time. By pressing Eleanor, a professional rival but ultimately a dead end, you gave Thorne the opening he needed. When you finally decide to refocus your efforts on him, you find his office cleared out and his apartment empty. The ledger, the recording, and Thorne himself are gone, vanished into the city's shadows. Lila is never seen again, her disappearance becoming just another one of the city's tragic, unsolved mysteries. Her voice is silenced forever, a faded melody in the memory of those who once heard her sing. The case goes cold.",
        background_audio: "rain",
        options: [],
        scene_id: "scene_9_dead_end",
      },
      {
        options: [],
        scene_id: "scene_10_good_ending",
        background_audio: "mystery",
        narration:
          "The sirens wail, their mournful song a fitting overture for the final act. Uniformed officers swarm The Velvet Serpent, taking a cuffed and defeated Marcus Thorne into custody. Following his confession, you lead a team down to the damp, musty wine cellar. There, in a locked room, you find her. Lila 'Lady Blue' Monroe is shaken and weak, but alive. As you help her into the rain-washed night, she looks at you, her eyes full of gratitude. Her voice may have been silenced for a few nights, but you know that soon, she'll be singing again. The serpent is caged, and his song is over.",
      },
    ],
  },
};

export default function LouvreHeistNoirPage() {
  const [currentScene, setCurrentScene] = useState<string>("scene_1");
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([]);
  const [caseData, setCaseData] = useState<StoryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1"]);
  const router = useRouter();

  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true);
      try {
        // This will fail, causing the catch block to run and use fallbackData
        const response = await axios.post<StoryData>(
          "http://localhost:8000/api/detective-story",
          {
            case: "noir_newyork",
          }
        );
        setCaseData(response.data);
      } catch (error) {
        console.warn("API call failed. Using fallback mock data.", error);
        setCaseData(fallbackData);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    };
    fetchCaseData();
  }, []);

  const scene = caseData?.story.scenes.find((s) => s.scene_id === currentScene);

  const handleOptionClick = (option: Option) => {
    // Add any clues from the current scene before moving to the next
    if (scene?.clues) {
      const newClueIds = scene.clues.map((clue) => clue.clue_id);
      setDiscoveredClues((prev) => [...new Set([...prev, ...newClueIds])]);
    }

    // Check for endings
    if (option.option_id.startsWith("END_")) {
      alert(option.description);
      return;
    }

    // Check for required clues
    if (
      option.required_clues &&
      !option.required_clues.every((req) => discoveredClues.includes(req))
    ) {
      alert("You're missing a key piece of evidence to proceed here.");
      return;
    }

    if (currentScene !== option.next_scene) {
      setSceneHistory((prev) => [...prev, option.next_scene]);
    }
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
        <p>Hitting the rain-slicked streets of Paris...</p>
        {/* Jsx styles for loading screen */}
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
          <h1>{caseData.story.title}</h1>
          <div className="clues-counter">
            Evidence Collected: {discoveredClues.length}
          </div>
        </div>
        <div className="scene-content">
          {sceneHistory.length > 1 && currentScene !== "scene_10" && (
            <button className="scene-back-button" onClick={handleBackToScene}>
              ← Rethink Your Move
            </button>
          )}
          <div className="narration-box">
            <h3>🕵️ Investigation</h3>
            <p className="narration">{scene.narration}</p>
          </div>
          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3>💬 The Word on the Street</h3>
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
              <h3>🔍 What You Found</h3>
              {scene.clues.map((clue) => (
                <div key={clue.clue_id} className="clue-item">
                  <strong>{clue.name}</strong>
                  <p>{clue.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="options-section">
            <h3>🤔 Your Next Move</h3>
            <div className="options-grid">
              {scene.options.map((option) => {
                const hasRequiredClues =
                  option.required_clues?.every((req) =>
                    discoveredClues.includes(req)
                  ) ?? true;
                return (
                  <button
                    key={option.option_id}
                    className="option-btn"
                    onClick={() => handleOptionClick(option)}
                    disabled={!hasRequiredClues}
                    title={!hasRequiredClues ? `Requires more evidence` : ""}
                  >
                    {option.description}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {discoveredClues.length > 0 && (
          <div className="evidence-sidebar">
            <h3>📋 Case File</h3>
            <div className="evidence-list">
              {discoveredClues.map((clueId, index) => {
                const clue = caseData.story.scenes
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
          ← Quit the Case
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
        .option-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 191, 255, 0.4);
          background: linear-gradient(45deg, #00ffff, #9370db);
        }
        .option-btn:disabled {
          background: linear-gradient(45deg, #34495e, #2c3e50);
          color: #7f8c8d;
          cursor: not-allowed;
          box-shadow: none;
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
