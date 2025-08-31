"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";

// --- Type Definitions for Incoming Data ---
interface Decision {
  decision_id: string;
  next_memory_id: string;
  description: string;
  outcome_type: string;
}

interface IntuitionPrompt {
  prompt_id: string;
  prompt_text: string;
}

interface Memory {
  memory_id: string;
  internal_monologue: string;
  decisions: Decision[];
  emotional_state: string;
  trauma_distortion_level: string;
  intuition_prompts?: IntuitionPrompt[];
}

interface SurvivorStoryData {
  story: {
    scenario_name: string;
    memories: Memory[];
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
  clues?: Clue[];
  dialogues?: any[]; // Not used in this data, but kept for UI compatibility
}

interface NarrativeCaseData {
  title: string;
  scenes: Scene[];
}

// --- Fallback Mock Data ---
const fallbackData: SurvivorStoryData = {
  story: {
    memories: [
      {
        internal_monologue:
          "My head is throbbing, a dissonant chord in the silence. Where am I? The last thing I remember is the warmth of the spotlight, the taste of gin, the final note of 'Midnight Serenade' hanging in the smoky air. Then a sweet, cloying smell on a handkerchief from the shadows of an alley. My heart is a frantic drum solo against my ribs. I can't see much, just oppressive darkness and a sliver of angry neon light under a heavy door. I have to stay calm, I have to think. Panic is a luxury I can't afford.",
        memory_id: "memory_1_awakening",
        decisions: [
          {
            description: "Try to get a better look at the room.",
            next_memory_id: "memory_2a_survey",
            decision_id: "1a",
            outcome_type: "TEMPORARY_SAFETY",
          },
          {
            decision_id: "1b",
            description: "Immediately rush the door.",
            next_memory_id: "memory_2b_rushdoor",
            outcome_type: "DANGEROUS_CONFRONTATION",
          },
        ],
        emotional_state: "CONFUSION",
        trauma_distortion_level: "HIGH",
      },
      {
        trauma_distortion_level: "MEDIUM",
        decisions: [
          {
            next_memory_id: "memory_3a_flashback",
            decision_id: "2a_1",
            outcome_type: "TEMPORARY_SAFETY",
            description:
              "Focus on the memory of the club, try to remember who the scent belongs to.",
          },
          {
            outcome_type: "TEMPORARY_SAFETY",
            description: "Search my purse for anything useful.",
            decision_id: "2a_2",
            next_memory_id: "memory_3b_searchpurse",
          },
        ],
        internal_monologue:
          "Okay, Lila, breathe. Just breathe. Let the fear be a rhythm, not a crescendo. My eyes adjust to the gloom. I’m on a bare, stained mattress. Across the small space, a rickety wooden chair and my own purse, its contents spilled like cheap secrets. But it's the smell again, stale cigar smoke... so familiar. It reminds me of someone at the club last night, a ghost at the edge of my memory. Who was he? The thought is hazy, a forgotten lyric.",
        intuition_prompts: [
          {
            prompt_id: "cigar_smell",
            prompt_text:
              "The scent of a specific, expensive brand of cigar seems familiar, connected to a recent memory.",
          },
        ],
        memory_id: "memory_2a_survey",
        emotional_state: "FEAR",
      },
      {
        emotional_state: "PANIC",
        trauma_distortion_level: "LOW",
        memory_id: "memory_2b_rushdoor",
        decisions: [
          {
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "2b_1",
            next_memory_id: "memory_outcome_trapped",
            description: "End of the line.",
          },
        ],
        internal_monologue:
          "There is no time to think, only to act. Adrenaline floods my veins, hot and sharp. I scramble to my feet, my head swimming, and throw my entire weight against the door. It barely budges, rattling in its frame. On the other side, I hear a heavy lock sliding. 'Awake already, songbird?' a gravelly voice says, dripping with menace. The door creaks open, and a hulking silhouette fills the frame. I didn't even have a chance.",
      },
      {
        trauma_distortion_level: "MEDIUM",
        memory_id: "memory_3a_flashback",
        intuition_prompts: [
          {
            prompt_id: "serpent_ring",
            prompt_text:
              "The man's ring, the silver serpent, feels like a significant clue.",
          },
        ],
        decisions: [
          {
            description:
              "Now that I remember his ring, search the room for anything connected to him.",
            decision_id: "3a_1",
            outcome_type: "TEMPORARY_SAFETY",
            next_memory_id: "memory_4a_searchclues",
          },
          {
            description:
              "Check the small, grimy window I can now faintly see high on the wall.",
            outcome_type: "ESCAPE_ROUTE",
            next_memory_id: "memory_4b_checkwindow",
            decision_id: "3a_2",
          },
        ],
        emotional_state: "DETERMINATION",
        internal_monologue:
          "I close my eyes, shutting out the concrete box and letting the memory wash over me. The Blue Dahlia club. The air thick with music, gin, and smoke. I was at the bar after my set when a man sat a few stools down, watching me in the mirror. He wore a gray fedora pulled low, and smoked a fat, expensive-looking cigar. He never said a word, just watched. I remember his ring, a silver serpent eating its own tail, catching the neon light as he grabbed me in the alley. That's him. That's the man.",
      },
      {
        trauma_distortion_level: "MEDIUM",
        emotional_state: "FEAR",
        internal_monologue:
          "My hands tremble as I gather my things. Compact, lipstick, a few loose dollars... and a bobby pin. My heart skips a beat. A bobby pin. It’s not much, but it’s a sliver of hope in this suffocating darkness. As I tuck it into my palm, my fingers brush against a business card I don't recognize. 'Vinnie ‘The Serpent’ Costello - Private Enquiries.' A cold dread washes over me. The name sounds dangerous, and I have no idea how his card got into my purse. Was he the one who took me?",
        decisions: [
          {
            next_memory_id: "memory_4c_picklock",
            description:
              "Use the bobby pin to try and pick the lock on the door.",
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "3b_1",
          },
          {
            description: "Try to remember who Vinnie 'The Serpent' is.",
            outcome_type: "TEMPORARY_SAFETY",
            next_memory_id: "memory_3a_flashback",
            decision_id: "3b_2",
          },
        ],
        memory_id: "memory_3b_searchpurse",
      },
      {
        trauma_distortion_level: "LOW",
        emotional_state: "PANIC",
        memory_id: "memory_4a_searchclues",
        internal_monologue:
          "Armed with the memory of the serpent ring, I scan the room with new eyes. Under the rickety chair, there's a crumpled matchbook. The logo is a snake eating its own tail. The 'Ouroboros Club'. I've heard whispers about it. A high-stakes gambling den downtown, run by a dangerous man named Costello. They call him 'The Serpent.' That's him. Knowing his name makes him real, and the danger feels a thousand times closer. I hear heavy footsteps approaching outside the door. I have no time.",
        decisions: [
          {
            outcome_type: "TEMPORARY_SAFETY",
            description: "Hide under the mattress and hope he doesn't see me.",
            next_memory_id: "memory_5a_hide",
            decision_id: "4a_1",
          },
          {
            outcome_type: "DANGEROUS_CONFRONTATION",
            description: "Use the chair to break the window and try to escape.",
            next_memory_id: "memory_5b_breakwindow",
            decision_id: "4a_2",
          },
        ],
      },
      {
        decisions: [
          {
            outcome_type: "ESCAPE_ROUTE",
            next_memory_id: "memory_5c_windowescape",
            decision_id: "4b_1",
            description:
              "Stack the chair on the mattress to reach the window latch.",
          },
          {
            decision_id: "4b_2",
            outcome_type: "DANGEROUS_CONFRONTATION",
            description:
              "Wait by the door and try to ambush him when he enters.",
            next_memory_id: "memory_5d_ambush",
          },
        ],
        memory_id: "memory_4b_checkwindow",
        trauma_distortion_level: "LOW",
        internal_monologue:
          "The window is high up, near the ceiling, and covered in years of city grime. Pushing the chair against the wall, I can just make out the fire escape of the next building over. It's a risk, but it's a chance. The window latch looks old and rusted, a single point of failure between me and freedom. I hear the distinct sound of a car engine cutting out on the street below. He's coming back. It's now or never. My fear is a cold, hard stone in my stomach, but my will to survive is a fire.",
        emotional_state: "DETERMINATION",
      },
      {
        trauma_distortion_level: "LOW",
        decisions: [
          {
            next_memory_id: "memory_outcome_trapped",
            decision_id: "4c_1",
            description: "My gamble failed.",
            outcome_type: "DANGEROUS_CONFRONTATION",
          },
        ],
        emotional_state: "PANIC",
        memory_id: "memory_4c_picklock",
        internal_monologue:
          "My fingers are clumsy, shaking, but I remember seeing a PI do this in a movie once. I slide the bobby pin into the heavy lock, feeling for the tumblers. It's hopeless. The lock is solid, unforgiving. I'm just scratching metal. A key scrapes the outside of the lock. He's here. My blood turns to ice. I wasted too much time on a fantasy. The door swings open and the hulking silhouette of Vinnie Costello fills the frame, his serpent ring glinting in the hall light.",
      },
      {
        emotional_state: "FEAR",
        trauma_distortion_level: "LOW",
        decisions: [
          {
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "5a_1",
            next_memory_id: "memory_6a_desperatepush",
            description:
              "Suddenly push the mattress up to knock him off balance and run.",
          },
          {
            decision_id: "5a_2",
            outcome_type: "TEMPORARY_SAFETY",
            description: "Stay completely still and silent.",
            next_memory_id: "memory_6b_silentgambit",
          },
        ],
        internal_monologue:
          "My heart hammers against my ribs as I squeeze myself under the filthy mattress. It smells of dust and despair. The door opens. Heavy footsteps enter the room. 'I know you're awake, Lila,' Vinnie's voice rasps. 'Your singing... it's worth a fortune. But you saw my face. A loose end.' He walks around the room, his footsteps getting closer. I hold my breath, praying he doesn't think to look. He pauses right by the bed. Time stands still.",
        memory_id: "memory_5a_hide",
      },
      {
        trauma_distortion_level: "LOW",
        emotional_state: "PANIC",
        internal_monologue:
          "There is no time for subtlety. I grab the wooden chair, the cheap wood groaning in protest. With a scream fueled by pure terror, I swing it with all my might against the grimy window. The glass shatters in a beautiful, terrible explosion of sound. Cold night air rushes in. But the noise... he must have heard it. The door bursts open as I'm halfway through the frame. Vinnie is there, his face a mask of fury. A shard of glass slices my arm as I pull myself through.",
        memory_id: "memory_5b_breakwindow",
        decisions: [
          {
            next_memory_id: "memory_outcome_injured",
            description: "Scramble onto the fire escape and run for it.",
            decision_id: "5b_1",
            outcome_type: "INJURY",
          },
        ],
      },
      {
        emotional_state: "DETERMINATION",
        decisions: [
          {
            decision_id: "5c_1",
            next_memory_id: "memory_outcome_escaped",
            outcome_type: "ESCAPE_ROUTE",
            description:
              "Climb down the fire escape into the anonymity of the city.",
          },
        ],
        trauma_distortion_level: "LOW",
        memory_id: "memory_5c_windowescape",
        internal_monologue:
          "The chair wobbles precariously on the mattress, but it gives me the height I need. My fingers, raw and scraped, work at the rusted latch. The lock on the main door clicks. My breath catches. The latch gives way with a groan just as the door begins to open. I don't look back. I scramble through the opening, dropping hard onto the cold, wet metal of a fire escape. The city's cacophony is the sweetest music I've ever heard.",
      },
      {
        internal_monologue:
          "Maybe I can catch him off guard. I press myself against the wall, my heart a trapped bird in a cage of ribs. I grab the only thing I can find, a loose brick from the crumbling wall. The door swings inward. I bring the brick down with all my might as he steps through. But he's too fast. He catches my wrist in a grip of iron, the serpent ring digging into my skin. 'Clever girl,' he snarls, his eyes cold. 'But not clever enough.'",
        decisions: [
          {
            next_memory_id: "memory_outcome_trapped",
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "5d_1",
            description: "A fatal miscalculation.",
          },
        ],
        trauma_distortion_level: "LOW",
        memory_id: "memory_5d_ambush",
        emotional_state: "PANIC",
      },
      {
        decisions: [
          {
            decision_id: "6a_1",
            next_memory_id: "memory_outcome_escaped",
            description: "Flee into the unknown building.",
            outcome_type: "ESCAPE_ROUTE",
          },
        ],
        internal_monologue:
          "Now! I shove the heavy mattress upward with every ounce of strength I have. It catches him in the legs, and he stumbles back with a curse. It's the only chance I'll get. I scramble out from under the bed and bolt for the open door. I feel a hand grab for my ankle, but I kick free. I'm in a dark, decrepit hallway, a staircase at the far end leading down into more darkness. I don't know where I'm going, I just run.",
        memory_id: "memory_6a_desperatepush",
        emotional_state: "PANIC",
        trauma_distortion_level: "LOW",
      },
      {
        decisions: [
          {
            next_memory_id: "memory_outcome_trapped",
            description: "Nowhere left to run.",
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "6b_1",
          },
        ],
        trauma_distortion_level: "LOW",
        internal_monologue:
          "I stay perfectly still, trying to will my heart to stop its frantic beating. For a moment that stretches into an eternity, there is only the sound of my own blood in my ears. Then, a low chuckle. The mattress is ripped away. Vinnie looms over me, a cruel smile on his face. 'Peek-a-boo,' he says. 'I always find what's mine.' The fight drains out of me, replaced by a cold, quiet emptiness.",
        memory_id: "memory_6b_silentgambit",
        emotional_state: "RESIGNATION",
      },
      {
        decisions: [],
        memory_id: "memory_outcome_escaped",
        internal_monologue:
          "The night air is cold and sharp, but I've never felt so alive. I run until my lungs burn, until the city lights blur into a watercolor painting. I don't look back. I don't know if he's following, and I don't care. I am just another shadow in the endless New York night, a ghost who slipped through a monster's fingers. I am free, and my song will not be silenced.",
        emotional_state: "DETERMINATION",
        trauma_distortion_level: "LOW",
      },
      {
        decisions: [],
        trauma_distortion_level: "LOW",
        internal_monologue:
          "Pain shoots up my arm from the gash, but the adrenaline keeps me going. I leap from the fire escape into the alley, landing hard and twisting my ankle. I limp into the crowded street, disappearing into the sea of anonymous faces. I'm hurt, bleeding, but I'm alive. He can't find me here. I'll carry these scars, a physical reminder of the song that almost cost me everything. The melody of my life now has a darker, more desperate key.",
        emotional_state: "FEAR",
        memory_id: "memory_outcome_injured",
      },
      {
        emotional_state: "RESIGNATION",
        memory_id: "memory_outcome_trapped",
        internal_monologue:
          "The fight goes out of me. There is no escape route, no clever plan, no final note to sing. There is only the cold, final certainty in his eyes. He steps closer, his shadow swallowing what little light there is in the room. My last thought is of the music, the one pure thing in my life, now silenced forever in a nameless, forgotten room. The city will never hear my voice again.",
        decisions: [],
        trauma_distortion_level: "LOW",
      },
    ],
    scenario_name: "The Serpent's Song",
  },
};

/**
 * Transforms survivor memory data into a narrative scene structure for the UI.
 */
const transformSurvivorData = (
  data: SurvivorStoryData | null
): NarrativeCaseData | null => {
  if (!data) return null;

  const scenes: Scene[] = data.story.memories.map((memory: Memory) => {
    const clues: Clue[] = [];

    // Add psychological states as clues
    clues.push({
      clue_id: `${memory.memory_id}_emotion`,
      name: "Emotional State",
      description: memory.emotional_state,
    });
    clues.push({
      clue_id: `${memory.memory_id}_trauma`,
      name: "Trauma Distortion",
      description: `Level: ${memory.trauma_distortion_level}`,
    });

    // Add intuition prompts as clues
    if (memory.intuition_prompts) {
      memory.intuition_prompts.forEach((prompt) => {
        clues.push({
          clue_id: prompt.prompt_id,
          name: "Intuition",
          description: prompt.prompt_text,
        });
      });
    }

    return {
      scene_id: memory.memory_id,
      narration: memory.internal_monologue,
      options: memory.decisions.map((d) => ({
        option_id: d.decision_id,
        next_scene: d.next_memory_id,
        description: d.description,
      })),
      clues: clues,
      dialogues: [],
    };
  });

  return {
    title: data.story.scenario_name,
    scenes: scenes,
  };
};

export default function SerpentsSongNoirPage() {
  const [currentScene, setCurrentScene] =
    useState<string>("memory_1_awakening");
  const [discoveredInsights, setDiscoveredInsights] = useState<string[]>([]);
  const [survivorData, setSurvivorData] = useState<SurvivorStoryData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sceneHistory, setSceneHistory] = useState<string[]>([
    "memory_1_awakening",
  ]);
  const router = useRouter();

  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post<SurvivorStoryData>(
          "http://localhost:8000/api/survivor-story",
          {
            case: "noir_newyork",
          }
        );
        setSurvivorData(response.data);
      } catch (error) {
        console.warn("API call failed. Using fallback mock data.", error);
        setSurvivorData(fallbackData);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    };
    fetchCaseData();
  }, []);

  const caseData = useMemo(
    () => transformSurvivorData(survivorData),
    [survivorData]
  );
  const scene = caseData?.scenes.find((s) => s.scene_id === currentScene);

  const handleOptionClick = (option: Option) => {
    if (scene?.clues) {
      const newClueIds = scene.clues.map((clue) => clue.clue_id);
      setDiscoveredInsights((prev) => [...new Set([...prev, ...newClueIds])]);
    }

    if (scene?.options.length === 0) {
      alert(`Outcome: ${scene.narration}`);
      return;
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
        <p>Recalling a fractured melody...</p>
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
        <h2>Memory Corrupted</h2>
        <Link href="/">Try to remember again</Link>
      </div>
    );
  }

  // Handle outcome scenes
  if (scene.options.length === 0) {
    if (scene.clues) {
      const newClueIds = scene.clues.map((clue) => clue.clue_id);
      // Add final scene's insights if not already there
      if (!newClueIds.every((id) => discoveredInsights.includes(id))) {
        setDiscoveredInsights((prev) => [...new Set([...prev, ...newClueIds])]);
      }
    }
  }

  return (
    <>
      <div className="case-container">
        <div className="noir-overlay"></div>
        <div className="case-header">
          <h1>{caseData.title}</h1>
          <div className="clues-counter">
            Insights Gained: {discoveredInsights.length}
          </div>
        </div>
        <div className="scene-content">
          {sceneHistory.length > 1 && scene.options.length > 0 && (
            <button className="scene-back-button" onClick={handleBackToScene}>
              ← Reconsider
            </button>
          )}
          <div className="narration-box">
            <h3>🧠 Internal Monologue</h3>
            <p className="narration">{scene.narration}</p>
          </div>

          {scene.clues && scene.clues.length > 0 && (
            <div className="clues-section">
              <h3>⚡️ Insights & Intuitions</h3>
              {scene.clues.map((clue) => (
                <div key={clue.clue_id} className="clue-item">
                  <strong>{clue.name}</strong>
                  <p>{clue.description}</p>
                </div>
              ))}
            </div>
          )}
          <div className="options-section">
            <h3>🤔 What do you do?</h3>
            <div className="options-grid">
              {scene.options.length > 0 ? (
                scene.options.map((option) => (
                  <button
                    key={option.option_id}
                    className="option-btn"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.description}
                  </button>
                ))
              ) : (
                <div className="ending-narration">
                  <p>This is the end of the memory.</p>
                  <button className="back-button" onClick={() => router.back()}>
                    Awaken
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {discoveredInsights.length > 0 && (
          <div className="evidence-sidebar">
            <h3>📋 Memory Fragments</h3>
            <div className="evidence-list">
              {discoveredInsights.map((clueId, index) => {
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
        <button className="back-button main-back" onClick={() => router.back()}>
          ← Fade to Black
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
        .back-button.main-back {
          position: fixed;
          bottom: 25px;
          left: 25px;
        }
        .back-button {
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
        .ending-narration {
          text-align: center;
          color: #cbd5e0;
          font-style: italic;
          font-size: 1.2rem;
        }
        .ending-narration .back-button {
          position: static;
          margin-top: 20px;
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
