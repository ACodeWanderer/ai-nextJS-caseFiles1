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
  trauma_distortion_level?: string;
  intuition_prompts?: IntuitionPrompt[];
  outcome_type?: any;
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
  clues: Clue[];
  dialogues: any[]; // Kept for UI compatibility
  background_audio: string; // Will be added during transformation
}

interface Ending {
  title: string;
  content: string;
}

// --- Fallback Mock Data ---
const fallbackData: SurvivorStoryData = {
  story: {
    memories: [
      {
        decisions: [
          {
            decision_id: "examine_scene",
            outcome_type: "DANGEROUS_CONFRONTATION",
            next_memory_id: "memory_2",
            description:
              "Forget escaping for a second. Look around the study. The answer to what's happening must be in this room.",
          },
          {
            decision_id: "sneak_out",
            description:
              "Get out now. Use the silence to your advantage and slip out the front door before you're found.",
            outcome_type: "ESCAPE_ROUTE",
            next_memory_id: "memory_3",
          },
          {
            outcome_type: "TEMPORARY_SAFETY",
            description:
              "Hide in the corner and call 911 immediately. Noise is a risk, but so is being alone.",
            next_memory_id: "memory_4",
            decision_id: "call_911",
          },
        ],
        internal_monologue:
          "The scent of old paper and leather is thick in the air, a smell I’ve always associated with Professor Albright. But now there's something else, a coppery tang that coats the back of my throat. My thesis sits on the edge of his mahogany desk, pages I was so proud of, now looking frivolous next to his slumped figure. His head rests on a scattered pile of books, a small, dark pistol loosely cradled in his hand on the floor. It looks so staged, so wrong, like a scene from a movie, not a life. My mind is screaming 'suicide,' but my body is frozen, every nerve ending alight with a primal terror that has nothing to do with death and everything to do with the living.",
        emotional_state: "CONFUSION",
        intuition_prompts: [
          {
            prompt_text:
              "A floorboard creaks on the second floor. The sound is faint, almost imaginary, but it's enough to shatter the stillness. You are not alone in this house.",
            prompt_id: "not_alone",
          },
        ],
        memory_id: "memory_1",
        trauma_distortion_level: "LOW",
      },
      {
        emotional_state: "FEAR",
        trauma_distortion_level: "MEDIUM",
        internal_monologue:
          "My legs feel like lead, but I force myself to move deeper into the room. The silence is a heavy blanket, and I'm terrified of tearing it. Every shadow seems to writhe in my peripheral vision. I need to understand what happened, why this feeling of being watched is crawling up my spine. This was my mentor, a man who saw potential in me. I owe him more than just running away in fear. The risk feels enormous, a crushing weight on my chest, but the thought of leaving without knowing the truth is somehow worse.",
        memory_id: "memory_2",
        decisions: [
          {
            description:
              "Read the note left on the desk. It might explain everything.",
            decision_id: "read_note",
            next_memory_id: "memory_5",
            outcome_type: "DANGEROUS_CONFRONTATION",
          },
          {
            outcome_type: "TEMPORARY_SAFETY",
            decision_id: "check_computer",
            next_memory_id: "memory_6",
            description:
              "Check his computer. It's still on, the screen glowing. The answer might be digital.",
          },
        ],
      },
      {
        trauma_distortion_level: "LOW",
        emotional_state: "PANIC",
        internal_monologue:
          "I pull the heavy study door open, the latch clicking with explosive volume. The grand hallway is a cavern of shadows, stretching out before me. I can hear faint, rhythmic breathing from the top of the stairs, a sound that isn't my own. My heart is a frantic drum against my ribs. He's up there, waiting or listening. I need to move, now. The front door is maybe twenty feet away, a lifetime away. Every instinct is screaming at me to run, to flee, to get out of this mausoleum.",
        decisions: [
          {
            next_memory_id: "memory_7",
            description:
              "The hallway is clear for now. Make a mad dash for the front door. Speed is your only ally.",
            decision_id: "run_front_door",
            outcome_type: "ESCAPE_ROUTE",
          },
          {
            outcome_type: "TEMPORARY_SAFETY",
            description:
              "That was too close. Duck into the hall closet and wait for the person to pass.",
            next_memory_id: "memory_8",
            decision_id: "hide_in_closet",
          },
        ],
        memory_id: "memory_3",
      },
      {
        decisions: [
          {
            decision_id: "barricade_door",
            description:
              "Forget the call for a second. Barricade the study door with the professor's heavy armchair.",
            outcome_type: "TEMPORARY_SAFETY",
            next_memory_id: "memory_9",
          },
          {
            decision_id: "whisper_to_operator",
            outcome_type: "DANGEROUS_CONFRONTATION",
            next_memory_id: "memory_10",
            description:
              "Stay on the line but be as quiet as possible. Whisper your location and the situation.",
          },
        ],
        trauma_distortion_level: "HIGH",
        internal_monologue:
          "I fumble for my phone, my fingers slick with sweat. The screen illuminates my terrified face. 9-1-1. The numbers seem alien. As my thumb hovers over the call button, I hear the footsteps upstairs quicken, moving with purpose. They know. Or they heard something. The dispatcher's voice will be a death sentence if he hears it. But what other choice do I have? I'm trapped, a rat in a cage, and my only hope is a voice on the other end of the line.",
        memory_id: "memory_4",
        emotional_state: "PANIC",
      },
      {
        internal_monologue:
          "The note isn't a confession; it's a warning. Written in the professor's frantic scrawl, it says, 'He's in the house. He wants the book. Don't let him get it. It's not what it seems.' My blood runs cold. He? Who is he? The note confirms my intuition, giving a name to the dread that fills this house. A heavy, leather-bound book with no title sits next to the note, its presence suddenly menacing. The footsteps upstairs stop directly overhead. He knows I'm here. He knows I've read it.",
        intuition_prompts: [
          {
            prompt_text:
              "The man upstairs isn't hunting you, he's hunting the object mentioned in the note. You are just an obstacle.",
            prompt_id: "the_target",
          },
        ],
        memory_id: "memory_5",
        emotional_state: "FEAR",
        decisions: [
          {
            next_memory_id: "memory_11",
            description:
              "The note mentioned a book. Grab the strange, leather-bound book from the desk. It must be important.",
            decision_id: "take_book",
            outcome_type: "ESCAPE_ROUTE",
          },
          {
            decision_id: "leave_it",
            next_memory_id: "memory_9",
            description:
              "Forget the book. It's not worth the time. Get out now.",
            outcome_type: "TEMPORARY_SAFETY",
          },
        ],
        trauma_distortion_level: "MEDIUM",
      },
      {
        memory_id: "memory_6",
        emotional_state: "DETERMINATION",
        decisions: [
          {
            description:
              "Look for a password nearby. Check under the keyboard or on the desk calendar.",
            decision_id: "find_password",
            outcome_type: "TEMPORARY_SAFETY",
            next_memory_id: "memory_12",
          },
          {
            description:
              "This is taking too long. Give up on the computer and barricade the door.",
            next_memory_id: "memory_9",
            outcome_type: "DANGEROUS_CONFRONTATION",
            decision_id: "abandon_computer",
          },
        ],
        internal_monologue:
          "The computer screen shows a simple password prompt. My mind races. Professor Albright was a man of routine and intellect. His password wouldn't be random. What would it be? The name of his favorite author? A philosophical concept? I can hear the floorboards above me groaning as the person upstairs moves around. It's a race against time, a battle of wits against a foe I can't see. Unlocking this computer feels like it could be the key to my survival, or the mistake that gets me killed.",
        trauma_distortion_level: "LOW",
      },
      {
        memory_id: "memory_7",
        decisions: [
          {
            description:
              "You've made it out. Run. Don't look back. Just run until the house is a speck in the distance.",
            outcome_type: "ESCAPE_ROUTE",
            next_memory_id: "memory_13",
            decision_id: "final_sprint",
          },
        ],
        internal_monologue:
          "The door groans open, revealing the moonlit street. Freedom. The air outside is cold and bites at my skin, a stark contrast to the suffocating warmth of the house. I don't dare look back. I just run, my legs pumping, my lungs burning. The sound of a window shattering behind me spurs me on, the noise of furious, impotent rage. I have escaped, but the memory of the professor's study and the silent man upstairs will be a ghost that haunts me forever. I have my life, but a piece of my sanity is lost in that house.",
        trauma_distortion_level: "LOW",
        emotional_state: "PANIC",
      },
      {
        memory_id: "memory_8",
        emotional_state: "RESIGNATION",
        internal_monologue:
          "Hiding was a mistake. The closet door is flimsy, offering no real protection. The footsteps pause right outside. I hold my breath, trying to will myself invisible, but it's useless. The doorknob turns slowly, a final, deliberate motion. The door swings open, and a tall, silhouetted figure fills the frame. I don't see a face, only darkness. There is no escape, no clever plan. There is only the end.",
        decisions: [
          {
            outcome_type: "DANGEROUS_CONFRONTATION",
            description: "You are trapped. This is the end.",
            decision_id: "trapped_end",
            next_memory_id: "memory_14",
          },
        ],
        trauma_distortion_level: "HIGH",
      },
      {
        decisions: [
          {
            decision_id: "wait_for_help",
            next_memory_id: "memory_10",
            description:
              "You're as safe as you can be. Wait for the police to arrive. Hope they get here in time.",
            outcome_type: "TEMPORARY_SAFETY",
          },
          {
            description:
              "Don't wait. Find a window, break it, and get out. The noise is a risk, but it's better than being a sitting duck.",
            next_memory_id: "memory_15",
            outcome_type: "INJURY",
            decision_id: "find_window",
          },
        ],
        internal_monologue:
          "The heavy armchair grinds against the wooden floor as I wedge it under the doorknob. It's not a fortress, but it's something. I've bought myself time. My heart rate slows just enough for a coherent thought to form. Now what? The man upstairs knows I'm in here; the sound of the chair was unmistakable. He'll be trying to get in. I scan the room, my eyes darting from the barred windows to the fireplace. I am cornered, but I am not dead yet.",
        emotional_state: "DETERMINATION",
        memory_id: "memory_9",
        trauma_distortion_level: "LOW",
      },
      {
        emotional_state: "FEAR",
        internal_monologue:
          "'He's in the study with me,' I whisper into the phone, tears streaming down my face. The dispatcher's calm voice is a strange anchor in the chaos. Suddenly, the door handle rattles violently, followed by a heavy thud against the wood. He's trying to break it down. Another thud, and a crack appears in the door panel. The police are on their way, but they're minutes away. He is seconds away. My temporary safety has become a death trap.",
        trauma_distortion_level: "HIGH",
        memory_id: "memory_10",
        decisions: [
          {
            outcome_type: "DANGEROUS_CONFRONTATION",
            next_memory_id: "memory_14",
            description:
              "The police are coming, but he's here now. There is no more running.",
            decision_id: "confrontation_end",
          },
        ],
      },
      {
        decisions: [
          {
            next_memory_id: "memory_9",
            outcome_type: "ESCAPE_ROUTE",
            description:
              "You have the book. Now get out. Barricade the door and find another way out.",
            decision_id: "escape_with_book",
          },
        ],
        memory_id: "memory_11",
        internal_monologue:
          "I snatch the heavy book, its leather cover strangely cold to the touch. It feels ancient and wrong. The footsteps overhead are moving towards the stairs with a new urgency. He knows what I've done. I'm no longer just a witness; I'm a threat. I have the one thing he was willing to kill for. This book is either my death warrant or my key to survival. I have to believe it's the latter.",
        trauma_distortion_level: "MEDIUM",
        emotional_state: "DETERMINATION",
      },
      {
        memory_id: "memory_12",
        internal_monologue:
          "A small sticky note is tucked under the monitor. 'Eleutheria'. A Greek word. Freedom. It was the subject of his last lecture. I type it in, and the desktop appears, a single document open on the screen. It's a journal entry. My eyes scan the first line: 'He came for the book tonight. I had to hide it. He doesn't know the study has a second way out.' A second way out? Hope, fierce and bright, ignites in my chest. But the doorknob on the study door begins to turn.",
        emotional_state: "DETERMINATION",
        trauma_distortion_level: "LOW",
        decisions: [
          {
            outcome_type: "TEMPORARY_SAFETY",
            description:
              "The computer is unlocked. Quickly, read the open file on the screen.",
            decision_id: "unlock_and_read",
            next_memory_id: "memory_5",
          },
        ],
        intuition_prompts: [
          {
            prompt_text:
              "The professor's journal mentions a second exit. The fireplace? Behind a bookshelf? You have a chance.",
            prompt_id: "secret_passage",
          },
        ],
      },
      {
        emotional_state: "DETERMINATION",
        outcome_type: "ESCAPE_ROUTE",
        internal_monologue:
          "I made it. I'm alive. The flashing lights of police cars swarm the house as I give my statement, my voice trembling. The book I saved is now evidence, and the man who hunted me is trapped. I replay my choices, the near-misses, the gut feelings. I didn't just stumble out of there; I made the right calls. The trauma will fade, but the knowledge that I stared into the abyss and found my way out will remain. I survived.",
        decisions: [],
        memory_id: "memory_13",
      },
      {
        outcome_type: "DANGEROUS_CONFRONTATION",
        decisions: [],
        memory_id: "memory_14",
        internal_monologue:
          "The darkness in the doorway consumes everything. My fight is over. My choices led me here, to this dead end. I think of the professor, and I finally understand his terror in those last moments. There is a strange calm that settles over me, the chilling acceptance of the inevitable. The silhouette moves, and my world fades to black.",
        emotional_state: "RESIGNATION",
      },
      {
        decisions: [],
        outcome_type: "INJURY",
        internal_monologue:
          "The shattering glass is deafening. I scramble through the broken window frame, the jagged edges tearing at my clothes and skin. I land hard on the damp grass outside, pain shooting up my leg. I don't care. I'm out. I limp away from the house of horrors, sirens wailing in the distance, a comforting sound promising safety. I'm injured, bleeding, but I'm alive. I got out. That's all that matters.",
        memory_id: "memory_15",
        emotional_state: "FEAR",
      },
    ],
    scenario_name: "The Professor's Study",
  },
};

const endings: Record<string, Ending> = {
  ending_escaped: {
    title: "Survived",
    content:
      "You made it. You're alive. The flashing lights of police cars swarm the house as you give your statement, your voice trembling. The choices you made, the risks you took—they led you here, to safety. The trauma will fade, but the knowledge that you stared into the abyss and found your way out will remain. You survived.",
  },
  ending_trapped: {
    title: "Trapped",
    content:
      "The darkness in the doorway consumes everything. Your fight is over. Your choices led you here, to this dead end. You think of the professor, and you finally understand his terror in those last moments. The silhouette moves, and your world fades to black.",
  },
  ending_injured: {
    title: "Wounded but Free",
    content:
      "The shattering glass is deafening. You scramble through the broken window, jagged edges tearing at your skin. You land hard outside, pain shooting up your leg, but you don't care. You're out. You limp away from the house of horrors, sirens wailing in the distance. You're injured, bleeding, but you're alive. You got out. That's all that matters.",
  },
};

/**
 * Transforms survivor memory data into a scene structure for the UI.
 */
const transformSurvivorData = (data: SurvivorStoryData | null) => {
  if (!data) return null;

  const scenes: Scene[] = data.story.memories.map((memory: Memory) => {
    const clues: Clue[] = [];
    clues.push({
      clue_id: `${memory.memory_id}_emotion`,
      name: "Current Emotion",
      description: memory.emotional_state,
    });
    clues.push({
      clue_id: `${memory.memory_id}_trauma`,
      name: "Trauma Level",
      description: `Distortion: ${memory.trauma_distortion_level}`,
    });
    if (memory.intuition_prompts) {
      memory.intuition_prompts.forEach((p) =>
        clues.push({
          clue_id: p.prompt_id,
          name: "Intuition",
          description: p.prompt_text,
        })
      );
    }

    const outcomeMap: Record<string, string> = {
      memory_13: "ending_escaped",
      memory_14: "ending_trapped",
      memory_15: "ending_injured",
    };

    return {
      scene_id: memory.memory_id,
      narration: memory.internal_monologue,
      clues,
      options: memory.decisions.map((d) => ({
        option_id: d.decision_id,
        description: d.description,
        next_scene: outcomeMap[d.next_memory_id] || d.next_memory_id,
      })),
      dialogues: [],
      background_audio: memory.emotional_state.toLowerCase(),
    };
  });

  return { title: data.story.scenario_name, scenes };
};

export default function ProfessorAlbrightStudyPage() {
  const router = useRouter();
  const [storyData, setStoryData] = useState<SurvivorStoryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentScene, setCurrentScene] = useState<string>("memory_1");
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([]);
  const [sceneHistory, setSceneHistory] = useState<string[]>(["memory_1"]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [ending, setEnding] = useState<string>("");

  useEffect(() => {
    const fetchStoryData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/survivor-story",
          {
            case: "professor_study",
          }
        );
        setStoryData(response.data);
      } catch (error) {
        console.warn("API call failed. Using fallback data.", error);
        setStoryData(fallbackData);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      }
    };
    if (!storyData) fetchStoryData();
  }, []);

  const narrativeData = useMemo(
    () => transformSurvivorData(storyData),
    [storyData]
  );
  const currentSceneData = narrativeData?.scenes.find(
    (scene) => scene.scene_id === currentScene
  );

  useEffect(() => {
    if (currentSceneData?.clues) {
      setDiscoveredClues((prev) => {
        const newClues = currentSceneData.clues.filter(
          (clue) => !prev.some((existing) => existing.clue_id === clue.clue_id)
        );
        return [...prev, ...newClues];
      });
    }
  }, [currentScene, currentSceneData]);

  const handleOptionClick = (option: Option) => {
    if (option.next_scene.startsWith("ending_")) {
      setGameEnded(true);
      setEnding(option.next_scene);
    } else {
      setCurrentScene(option.next_scene);
      setSceneHistory((prev) => [...prev, option.next_scene]);
    }
  };

  const handleBackClick = () => {
    if (sceneHistory.length > 1) {
      const newHistory = sceneHistory.slice(0, -1);
      const previousScene = newHistory[newHistory.length - 1];
      setSceneHistory(newHistory);
      setCurrentScene(previousScene);
    }
  };

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
            <h1 className="text-3xl font-serif text-amber-200">Outcome</h1>
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
                Insights Gained: {discoveredClues.length}
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
          <p className="text-lg font-serif">Recalling memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/professor-study.jpg')`,
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
            Go Back
          </button>
        </div>
      )}

      <div className="scene-content">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-serif text-amber-200">
              {narrativeData?.title}
            </h1>
          </div>
          <div className="scene-counter">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-200">
              Memory {sceneHistory.length}
            </span>
          </div>
        </div>
        <div className="narration-box">
          <h2 className="text-xl font-serif text-amber-300 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Internal Monologue
          </h2>
          <p className="text-amber-100 leading-relaxed text-lg font-serif">
            {currentSceneData.narration}
          </p>
        </div>

        <div className="options-section">
          <h3 className="text-lg font-serif text-amber-300 mb-4">
            What do you do?
          </h3>
          <div className="options-grid">
            {currentSceneData.options.map((option) => (
              <button
                key={option.option_id}
                onClick={() => handleOptionClick(option)}
                className="option-button"
              >
                {option.description}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="evidence-sidebar">
        <div className="sidebar-header">
          <h3 className="text-lg font-serif text-amber-300 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Insights & Fragments
          </h3>
        </div>
        <div className="clues-list">
          {discoveredClues.map((clue) => (
            <div key={clue.clue_id} className="clue-item">
              <div className="clue-name">{clue.name}</div>
              <div className="text-xs text-amber-200 mt-1">
                {clue.description}
              </div>
            </div>
          ))}
          {discoveredClues.length === 0 && (
            <div className="text-amber-400 text-sm italic">
              No insights yet...
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
        /* All original styles are preserved. Only minor label changes were made. */
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
        }
        .option-button {
          text-align: left;
          padding: 24px 32px;
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
