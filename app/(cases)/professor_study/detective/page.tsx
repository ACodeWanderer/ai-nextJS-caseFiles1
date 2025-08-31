"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

interface Ending {
  title: string;
  content: string;
}

// --- Fallback Mock Data ---
const fallbackData: StoryData = {
  story: {
    title: "The Serpent's Quill",
    scenes: [
      {
        narration:
          "The heavy oak door of Professor Alistair Finch's study groans open to reveal a scene of grim stillness. The air is thick with the scent of old leather, spilled ink, and something faintly almond-like. Finch himself is slumped over a grand mahogany desk, his head resting on a scattered pile of manuscripts. The room is a fortress of knowledge, lined wall-to-wall with books, but a profound and unnerving silence has conquered this domain. A single lamp casts a golden glow on the deceased, leaving the corners of the room in deep shadow. From this first glance, there are no obvious signs of struggle; it is a portrait of unnaturally peaceful death.",
        options: [
          {
            option_id: "1A",
            next_scene: "scene_2",
            description:
              "Examine Professor Finch's body and the immediate desk area.",
          },
          {
            option_id: "1B",
            description:
              "Survey the entire room for points of entry or anything out of place.",
            next_scene: "scene_3",
          },
        ],
        background_audio: "crime_scene",
        scene_id: "scene_1",
      },
      {
        background_audio: "mystery",
        scene_id: "scene_2",
        narration:
          "You approach the desk, your footsteps muffled by the plush Persian rug. Professor Finch's expression is placid, his eyes closed as if in deep thought. His hands rest on the desk, palms down. As you gently inspect his right hand, you notice a minuscule puncture mark on his index finger, so small it could be mistaken for a papercut. Beside his hand lies a beautiful, old-fashioned quill pen with an iridescent feather. Its metallic nib seems unusually sharp, glinting under the lamplight like a serpent's fang. There is no blood, only the dark stain of ink spreading from a knocked-over well.",
        options: [
          {
            description:
              "Bag the quill as evidence and search the rest of the desk.",
            next_scene: "scene_4",
            option_id: "2A",
          },
        ],
        clues: [
          {
            clue_id: "CLUE_01",
            name: "Antique Quill Pen",
            description:
              "An ornate quill pen with an unusually sharp, needle-like point. Found next to the victim's hand.",
          },
        ],
      },
      {
        background_audio: "tension",
        options: [
          {
            description:
              "The room is sealed. Focus the investigation on the contents of the desk.",
            next_scene: "scene_4",
            option_id: "3A",
          },
        ],
        narration:
          "You decide to assess the room as a whole. The windows are tall and imposing, their heavy latches fastened securely from the inside. You check the main door; the heavy deadbolt is shot across, also locked from within. It’s a classic locked-room mystery. There are no other entrances, not even a fireplace. The room is a sealed tomb, leaving only two possibilities: either the professor was alone when he died, or a killer has somehow vanished into thin air. The oppressive silence of the study suddenly feels heavier, charged with impossibility.",
        scene_id: "scene_3",
      },
      {
        options: [
          {
            next_scene: "scene_5",
            description: "Pursue the clear motive. Interview Dr. Julian Croft.",
            option_id: "4A",
          },
          {
            description:
              "The notes are key. Find his research assistant, who may be able to translate them.",
            next_scene: "scene_6",
            option_id: "4B",
          },
        ],
        scene_id: "scene_4",
        narration:
          "The professor's desk is an island of organized chaos. Amidst stacks of books on toxicology and ancient history, two items seize your attention. The first is a journal filled with what appears to be research notes, written in a complex cipher of symbols and archaic text. The second is a letter, left open. Its contents are scathing; a fellow academic, Dr. Julian Croft, accuses Finch of intellectual theft and threatens to expose him. The letter is dated for yesterday. It provides a clear motive for an enemy, yet the cryptic journal suggests a man obsessed with secrets of his own.",
        clues: [
          {
            name: "Encrypted Research Notes",
            description:
              "A journal filled with complex ciphers and diagrams related to historical poisons.",
            clue_id: "CLUE_03",
          },
          {
            clue_id: "CLUE_04",
            name: "Letter from Croft",
            description:
              "A letter from Dr. Julian Croft accusing Finch of academic fraud and threatening his reputation.",
          },
        ],
        background_audio: "mystery",
      },
      {
        narration:
          "Dr. Julian Croft is a man as sharp and severe as his tailored suit. He doesn't bother hiding his contempt for Finch, calling him a 'theatrical hack' who stole his research. Yet, he has an airtight alibi, verified by a lecture hall full of students. 'Murder?' Croft scoffs, a cruel smile playing on his lips. 'Alistair was far too arrogant for that. He was obsessed with creating the perfect, undetectable poison. If you ask me, the old fool probably poisoned himself with one of his ridiculous toys.' He dismisses the matter, leaving you with more questions than answers.",
        background_audio: "silence",
        dialogues: [
          {
            character: "Dr. Julian Croft",
            speech:
              "Look for his assistant, the mousy one... Eleanor. She was his shadow, privy to all of his little secrets. If anyone knows about Alistair's melodramatic schemes, it's her.",
          },
        ],
        scene_id: "scene_5",
        options: [
          {
            option_id: "5A",
            description:
              "Croft's lead is the only one you have. Find the assistant, Eleanor Vance.",
            next_scene: "scene_6",
          },
        ],
      },
      {
        clues: [
          {
            name: "Deciphered Note",
            description:
              "A translated passage from the research notes: 'The serpent's kiss is painless, undetectable. A perfect end for a life's work.'",
            clue_id: "CLUE_06",
          },
        ],
        narration:
          "Eleanor Vance, the professor's research assistant, is pale and visibly shaken. She sits in a small, book-lined office, clutching a handkerchief. She speaks of Finch with a reverence that borders on obsession, calling him a misunderstood genius. When you show her the encrypted journal, her eyes fill with a strange light. She recognizes the cipher and, with trembling fingers, translates a recently penned passage. It speaks of a 'serpent's kiss' - a poison delivered via a tiny scratch, painless and utterly untraceable, designed to mimic a natural death. A perfect end to a life's work.",
        background_audio: "rain",
        options: [
          {
            option_id: "6A",
            next_scene: "scene_7",
            description:
              "Her story is compelling. Search the study's wastebasket for anything he might have discarded.",
          },
          {
            option_id: "6B",
            description:
              "Interview the professor's estranged wife, Isabelle Finch.",
            next_scene: "scene_8",
          },
        ],
        dialogues: [
          {
            speech:
              "After Dr. Croft's letter arrived... he became withdrawn. He said his reputation was everything. He kept looking at his collection of historical artifacts, especially the contents of his desk...",
            character: "Eleanor Vance",
          },
        ],
        scene_id: "scene_6",
      },
      {
        options: [
          {
            option_id: "7A",
            description:
              "You have a potential poison and motive. It's time to speak with his wife, Isabelle Finch.",
            next_scene: "scene_8",
          },
          {
            description:
              "With all the physical evidence gathered, return to the study to piece it all together.",
            option_id: "7B",
            next_scene: "scene_9",
          },
        ],
        scene_id: "scene_7",
        narration:
          "Following Eleanor's hint, you return to the study and meticulously examine the contents of the wastepaper basket. Beneath crumpled drafts of academic papers, your gloved fingers find it: a small, unlabeled glass vial. It is half-empty, containing a clear, slightly viscous liquid that has no discernible odor. This could be anything, but in a room where a man is dead from a mysterious ailment, it feels like a crucial piece of the puzzle. Was this the vessel for the 'serpent's kiss'?",
        background_audio: "tension",
        clues: [
          {
            clue_id: "CLUE_02",
            name: "Half-Empty Vial",
            description:
              "A small, unlabeled glass vial found in the wastebasket, containing a clear, viscous liquid.",
          },
        ],
      },
      {
        options: [
          {
            next_scene: "scene_9",
            description:
              "Her motive is strong, but the locked room and her alibi are stronger. The truth lies back in the study.",
            option_id: "8A",
          },
        ],
        scene_id: "scene_8",
        clues: [
          {
            clue_id: "CLUE_05",
            name: "Insurance Policy",
            description:
              "A recently updated life insurance policy for a large sum, naming Isabelle Finch as the sole beneficiary.",
          },
        ],
        narration:
          "Isabelle Finch is the picture of detached elegance. She sips her tea in a lavishly decorated sitting room, showing no signs of grief. She speaks of her husband with a cool indifference, describing their marriage as a 'mutually beneficial arrangement.' When you inquire about finances, she confirms her husband's life was insured for a substantial sum. With a bit more pressure, her lawyer produces the policy. It was updated a month ago, doubling the payout and making her the sole beneficiary. She has a motive written on expensive paper, but her alibi for the time of death is disappointingly solid.",
        background_audio: "fireplace",
      },
      {
        narration:
          "You stand alone in the silent study once more. The air is still, but the clues swirl around you in a storm of possibilities. The locked room, the pinprick on his finger, the poisoned quill, the scathing letter, the cryptic notes, the ambitious wife, the devoted assistant. Every piece of evidence tells a different story. Was it the rival who drove him to despair? The wife who sought a fortune? Or was the professor himself the architect of this entire affair? The final truth is not a matter of what you've found, but how you choose to assemble the facts.",
        scene_id: "scene_9",
        background_audio: "tension",
        options: [
          {
            option_id: "9A",
            required_clues: ["CLUE_01", "CLUE_04", "CLUE_06"],
            next_scene: "scene_10",
            description:
              "Conclusion: It was a meticulously planned suicide. Finch used the poisoned quill to end his life, staging it as a perfect, unsolvable murder to posthumously ruin his rival and seal his own legend.",
          },
          {
            description:
              "Conclusion: It was murder for profit. Isabelle Finch, despite her alibi, must have found a way to administer the poison and lock the room from the outside, perhaps with a mechanism you missed.",
            required_clues: ["CLUE_05"],
            option_id: "9B",
            next_scene: "scene_10",
          },
          {
            required_clues: ["CLUE_01", "CLUE_02"],
            option_id: "9C",
            description:
              "Conclusion: It was an accident. The professor, in his obsessive research, mishandled the poisoned quill. A tragic, ironic end for a master of toxicology.",
            next_scene: "scene_10",
          },
        ],
      },
      {
        scene_id: "scene_10",
        background_audio: "silence",
        dialogues: [
          {
            character: "Detective's Final Thought",
            speech: "Some rooms are never truly unlocked.",
          },
        ],
        options: [],
        narration:
          "You file your official report, closing the case of Professor Alistair Finch. Your chosen conclusion dictates the narrative that will be remembered. Whether the world sees him as a tragic victim, a misunderstood genius curating his own death, or a careless academic, the silence of the study will keep its final secrets. The ambiguity may linger in your mind for years to come, a testament to a puzzle where the most important piece was the mind of the man at its center. The files are boxed, the case is closed, but the serpent's quill leaves an indelible mark on your career.",
      },
    ],
  },
};

// Endings object derived from the story data
const finalNarration =
  "You file your official report, closing the case of Professor Alistair Finch. Your chosen conclusion dictates the narrative that will be remembered. The files are boxed, the case is closed, but the serpent's quill leaves an indelible mark on your career.";
const endings: Record<string, Ending> = {
  ending_suicide: {
    title: "A Meticulously Planned Suicide",
    content: `You conclude that Finch, facing public humiliation from his rival, decided to curate his own death. He used his knowledge of toxicology to create a painless, untraceable poison, delivered by the antique quill. He staged it as a locked-room mystery to cast suspicion on his rival, Dr. Croft, ensuring his own legacy as a tormented genius. ${finalNarration}`,
  },
  ending_murder: {
    title: "A Cunning Murder for Profit",
    content: `You conclude that Isabelle Finch, motivated by the large insurance payout, is the primary suspect. Despite her alibi, the means and motive are too strong to ignore. You suspect she manipulated her husband or used a delayed poison and a clever mechanism to lock the study from the outside, a detail that remains tantalizingly out of reach. ${finalNarration}`,
  },
  ending_accident: {
    title: "A Tragic Academic Accident",
    content: `You conclude that Professor Finch's death was a tragic miscalculation. In his obsessive pursuit of historical poisons, he became careless. A simple slip while handling the toxic quill led to his own demise—an ironic and unfortunate end for a man so dedicated to his dangerous craft. ${finalNarration}`,
  },
};

export default function SerpentsQuillCase() {
  const router = useRouter();
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentScene, setCurrentScene] = useState<string>("scene_1");
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([]);
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1"]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [ending, setEnding] = useState<string>("");

  useEffect(() => {
    const fetchStoryData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post<StoryData>(
          "http://localhost:8000/api/detective-story",
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

  useEffect(() => {
    const scene = storyData?.story.scenes.find(
      (s) => s.scene_id === currentScene
    );
    if (scene?.clues) {
      setDiscoveredClues((prev) => {
        const newClues = scene.clues!.filter(
          (clue) => !prev.some((existing) => existing.clue_id === clue.clue_id)
        );
        return [...prev, ...newClues];
      });
    }
  }, [currentScene, storyData]);

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

  const currentSceneData = storyData?.story.scenes.find(
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
                Clues Discovered: {discoveredClues.length}
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
            Previous Scene
          </button>
        </div>
      )}

      <div className="scene-content">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-serif text-amber-200">
              {storyData?.story.title}
            </h1>
          </div>
          <div className="scene-counter">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-200">
              Scene {currentScene.split("_")[1]}/
              {storyData?.story.scenes.length}
            </span>
          </div>
        </div>
        <div className="narration-box">
          <h2 className="text-xl font-serif text-amber-300 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Investigation Notes
          </h2>
          <p className="text-amber-100 leading-relaxed text-lg font-serif">
            {currentSceneData.narration}
          </p>
        </div>

        {currentSceneData.dialogues &&
          currentSceneData.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3 className="text-lg font-serif text-amber-300 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Conversations
              </h3>
              <div className="space-y-3">
                {currentSceneData.dialogues.map((dialogue, index) => (
                  <div key={index} className="dialogue-item">
                    <div className="font-semibold text-amber-300 mb-2">
                      {dialogue.character}:
                    </div>
                    <div className="text-amber-100 italic">
                      "{dialogue.speech}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        <div className="options-section">
          <h3 className="text-lg font-serif text-amber-300 mb-4">
            Your Next Move:
          </h3>
          <div className="options-grid">
            {currentSceneData.options.map((option) => {
              const hasRequiredClues =
                option.required_clues?.every((req) =>
                  discoveredClues.some((c) => c.clue_id === req)
                ) ?? true;
              return (
                <button
                  key={option.option_id}
                  onClick={() => handleOptionClick(option)}
                  className="option-button"
                  disabled={!hasRequiredClues}
                  title={
                    !hasRequiredClues
                      ? `Requires specific evidence to proceed.`
                      : ""
                  }
                >
                  {option.description}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="evidence-sidebar">
        <div className="sidebar-header">
          <h3 className="text-lg font-serif text-amber-300 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Evidence Collected
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
              No evidence collected yet...
            </div>
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-purple-400/30">
          <div className="text-xs text-amber-400">
            Atmosphere: {currentSceneData.background_audio}
          </div>
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
        .dialogue-item {
          background: rgba(88, 28, 135, 0.4);
          border: 1px solid rgba(192, 132, 252, 0.2);
          border-radius: 8px;
          padding: 16px;
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
        .option-button:disabled {
          background: rgba(55, 30, 82, 0.5);
          color: #a78bfa;
          cursor: not-allowed;
          border-color: rgba(139, 92, 246, 0.2);
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
