"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ArrowLeft, Snowflake, Mountain } from "lucide-react"

const storyData = {
  scenes: [
    {
      scene_id: "scene_1",
      narration:
        "The wind howls like a banshee outside Pine Ridge Lodge, rattling the frosted windows as snow continues to pile against the wooden walls. You arrive as Detective Morgan Hayes, called to investigate what should have been a peaceful weekend retreat that has turned into a nightmare. The lodge sits isolated on the mountainside, its warm lights barely visible through the swirling blizzard that has cut off all roads and communication with the outside world. Inside, eight guests huddle around the massive stone fireplace, their faces etched with fear and suspicion. The victim, renowned architect Jonathan Blackwood, lies dead in the locked study upstairs, discovered just an hour ago by the lodge owner. The killer is among these frightened souls, and with no way to leave until the storm passes, you must uncover the truth before panic takes hold completely.",
      dialogues: [
        {
          character: "Lodge Owner Martha",
          speech:
            "Detective Hayes, thank God you made it before the roads became completely impassable. Jonathan is... was... in the study. The door was locked from the inside.",
        },
        { character: "You", speech: "When was Mr. Blackwood last seen alive, and who discovered the body?" },
        {
          character: "Martha",
          speech:
            "He went to the study after dinner around 9 PM. I found him at 10:30 when I brought him his evening brandy. The door was locked, but I have a master key.",
        },
      ],
      background_audio: "mystery",
      clues: [
        {
          clue_id: "locked_study",
          name: "Locked Study",
          description: "The study was locked from the inside when the body was discovered",
        },
        {
          clue_id: "master_key",
          name: "Master Key",
          description: "Martha has a master key that can open all rooms in the lodge",
        },
      ],
      options: [
        { option_id: "opt_1_1", description: "Examine the crime scene in the study", next_scene: "scene_2" },
        { option_id: "opt_1_2", description: "Interview the guests in the main hall", next_scene: "scene_3" },
        { option_id: "opt_1_3", description: "Inspect the lodge's layout and exits", next_scene: "scene_4" },
      ],
    },
    {
      scene_id: "scene_2",
      narration:
        "The study is a testament to old-world elegance, with leather-bound books lining mahogany shelves and a heavy oak desk dominating the center of the room. Jonathan Blackwood sits slumped in his chair, a half-empty glass of brandy beside him and architectural blueprints scattered across the desk surface. The room smells of aged whiskey and something else - a faint, bitter almond scent that makes your detective instincts prickle with recognition. The windows are sealed shut against the storm, their locks undisturbed, and the only entrance is the door through which you entered. You notice the fireplace has been recently used, with fresh ash in the grate, and there's a peculiar burn mark on one of the blueprints. The victim's face shows no signs of struggle, but his fingernails have a slight blue tinge that confirms your growing suspicion about the cause of death.",
      dialogues: [
        {
          character: "You",
          speech:
            "The bitter almond smell... this looks like cyanide poisoning. But how was it administered in a locked room?",
        },
        {
          character: "Martha",
          speech:
            "I brought him his usual evening brandy at 10:30. He always had the same routine - work until late with his drink.",
        },
        {
          character: "You",
          speech: "Who else knew about this routine? And what are these blueprints he was working on?",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "cyanide_poisoning",
          name: "Cyanide Poisoning",
          description: "The bitter almond smell and blue fingernails suggest cyanide poisoning",
        },
        {
          clue_id: "brandy_glass",
          name: "Brandy Glass",
          description: "Half-empty glass of brandy found beside the victim",
        },
        {
          clue_id: "burned_blueprint",
          name: "Burned Blueprint",
          description: "One of the architectural blueprints has a peculiar burn mark",
        },
      ],
      options: [
        { option_id: "opt_2_1", description: "Test the brandy glass for poison", next_scene: "scene_5" },
        { option_id: "opt_2_2", description: "Examine the burned blueprint more closely", next_scene: "scene_6" },
        { option_id: "opt_2_3", description: "Question Martha about who knew the routine", next_scene: "scene_3" },
        { option_id: "opt_2_4", description: "Check the fireplace and ash", next_scene: "scene_7" },
      ],
    },
    {
      scene_id: "scene_3",
      narration:
        "The main hall buzzes with nervous energy as seven guests cluster in small groups, their conversations dying as you approach. The massive stone fireplace casts dancing shadows across worried faces, each person a potential suspect in this deadly game of survival. Dr. Elizabeth Chen, a psychiatrist, sits rigidly in a wingback chair, her medical bag clutched tightly in her lap. Business partner Robert Sterling paces near the windows, occasionally peering out at the relentless storm. Sarah Blackwood, the victim's estranged daughter, stares into the fire with red-rimmed eyes, while her boyfriend Marcus Webb hovers protectively nearby. Lodge handyman Tom Bradley fidgets with his tools, and elderly guest Professor William Hayes examines a chess set with scholarly intensity. The atmosphere is thick with unspoken accusations and barely contained fear, as everyone realizes that one among them is a cold-blooded killer.",
      dialogues: [
        {
          character: "Dr. Chen",
          speech:
            "This is absolutely horrific. Jonathan seemed perfectly fine at dinner. We were discussing his new project.",
        },
        {
          character: "Robert Sterling",
          speech: "He was stressed about the Riverside development. There were... complications with the permits.",
        },
        {
          character: "Sarah Blackwood",
          speech: "My father had many enemies. His business practices weren't always ethical.",
        },
        { character: "Marcus Webb", speech: "Sarah, you shouldn't say such things. Not now." },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "business_complications",
          name: "Business Complications",
          description: "Robert Sterling had issues with the Riverside development permits",
        },
        {
          clue_id: "family_tension",
          name: "Family Tension",
          description: "Sarah Blackwood mentioned her father's business practices weren't ethical",
        },
      ],
      options: [
        { option_id: "opt_3_1", description: "Question Dr. Chen about her medical knowledge", next_scene: "scene_8" },
        {
          option_id: "opt_3_2",
          description: "Investigate Robert Sterling's business relationship",
          next_scene: "scene_9",
        },
        { option_id: "opt_3_3", description: "Speak privately with Sarah about family issues", next_scene: "scene_10" },
        {
          option_id: "opt_3_4",
          description: "Ask about everyone's whereabouts during the murder",
          next_scene: "scene_5",
        },
      ],
    },
    {
      scene_id: "scene_4",
      narration:
        "Pine Ridge Lodge is a fortress against the mountain wilderness, its thick log walls and heavy timber construction designed to withstand the harshest winters. You methodically examine every possible entrance and exit, finding that the storm has effectively sealed the building like a tomb. The front door is blocked by a six-foot snowdrift, while the back entrance leads to a service area where Tom Bradley stores his maintenance equipment. The kitchen has a delivery door, but it too is buried under snow and hasn't been opened in days according to the undisturbed accumulation. Windows throughout the lodge are either painted shut or secured with storm shutters, and the second-floor windows would require a ladder to reach from outside. Most telling of all, you discover that the lodge's landline has been cut - not by the storm, but by human hands, the clean slice through the cable hidden beneath the porch. This was no crime of opportunity; someone planned this murder knowing the guests would be trapped and isolated.",
      dialogues: [
        {
          character: "Tom Bradley",
          speech: "I checked all the doors and windows this morning after the storm hit. Everything's sealed tight.",
        },
        { character: "You", speech: "What about this cut phone line? When did you last use the landline?" },
        {
          character: "Tom",
          speech:
            "Yesterday evening, around 8 PM. I called my wife to let her know I'd be staying over due to the weather.",
        },
      ],
      background_audio: "mystery",
      clues: [
        { clue_id: "cut_phone_line", name: "Cut Phone Line", description: "The landline has been cut by human hands" },
        {
          clue_id: "planned_murder",
          name: "Planned Murder",
          description: "Someone planned the murder knowing the guests would be trapped",
        },
        {
          clue_id: "isolated_lodge",
          name: "Isolated Lodge",
          description: "The lodge is effectively sealed due to the storm",
        },
      ],
      options: [
        { option_id: "opt_4_1", description: "Confront the group about the cut phone line", next_scene: "scene_3" },
        { option_id: "opt_4_2", description: "Question Tom Bradley about his access to tools", next_scene: "scene_7" },
        { option_id: "opt_4_3", description: "Return to examine the study more thoroughly", next_scene: "scene_2" },
        { option_id: "opt_4_4", description: "Check the kitchen and service areas", next_scene: "scene_6" },
      ],
    },
    {
      scene_id: "scene_5",
      narration:
        "Your investigation of the brandy glass reveals the horrifying truth about the murder method, as chemical tests confirm the presence of potassium cyanide in the amber liquid. The poison was expertly mixed, requiring both knowledge of chemistry and access to the deadly compound, narrowing your suspect list considerably. You gather the guests to establish their alibis for the crucial time between 9 PM when Jonathan entered the study and 10:30 when his body was discovered. Dr. Chen claims she was reading medical journals in her room, while Robert Sterling insists he was making business calls from the lobby phone. Sarah and Marcus say they were together in the game room playing cards, though their stories have slight inconsistencies about who won which hands. Tom Bradley was supposedly fixing a leaky faucet in the basement, and Professor Hayes was organizing his research notes in the library. Martha was in the kitchen preparing tomorrow's breakfast and cleaning up from dinner. Each alibi seems plausible on the surface, but you notice nervous glances and fidgeting that suggest not everyone is telling the complete truth about their whereabouts during those critical ninety minutes.",
      dialogues: [
        {
          character: "You",
          speech:
            "The brandy was definitely poisoned with cyanide. This required both chemical knowledge and premeditation.",
        },
        {
          character: "Dr. Chen",
          speech: "Cyanide? That's... that's a horrible way to die. Who would have access to such a thing?",
        },
        { character: "Robert Sterling", speech: "This is insane. We're all trapped here with a murderer!" },
        {
          character: "Professor Hayes",
          speech:
            "Actually, cyanide isn't that difficult to obtain if you know where to look. Photography chemicals, certain industrial processes...",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "confirmed_cyanide",
          name: "Confirmed Cyanide",
          description: "Potassium cyanide was found in the brandy glass",
        },
        {
          clue_id: "alibis_collected",
          name: "Alibis Collected",
          description: "Guests provided alibis for the time of the murder",
        },
        {
          clue_id: "chemical_knowledge",
          name: "Chemical Knowledge",
          description: "Someone had knowledge of chemistry to mix the poison",
        },
      ],
      options: [
        { option_id: "opt_5_1", description: "Focus on suspects with chemical knowledge", next_scene: "scene_8" },
        { option_id: "opt_5_2", description: "Investigate inconsistencies in the alibis", next_scene: "scene_9" },
        { option_id: "opt_5_3", description: "Search for the source of the cyanide", next_scene: "scene_6" },
        { option_id: "opt_5_4", description: "Examine the victim's personal relationships", next_scene: "scene_10" },
      ],
    },
    {
      scene_id: "scene_6",
      narration:
        "The kitchen and service areas of Pine Ridge Lodge reveal a treasure trove of potential evidence and hiding places for both murder weapons and motives. In the pantry, you discover an old photography darkroom that Professor Hayes had been using to develop pictures from his research expedition, complete with chemical baths that could easily mask the acquisition of cyanide compounds. The burned blueprint from the study becomes clearer under proper lighting - it shows plans for a controversial shopping complex that would destroy a historic neighborhood, with Jonathan's signature prominently displayed as the lead architect. Hidden behind cleaning supplies, you find a small vial that once contained potassium cyanide, its label partially torn but still readable, along with a syringe that could have been used to inject the poison into the brandy bottle. Most intriguingly, you discover a series of threatening letters in the trash, written in different handwritings but all expressing outrage about the Riverside development project. The killer was methodical, using the lodge's own resources and taking advantage of the isolated location to commit what they believed would be the perfect crime.",
      dialogues: [
        {
          character: "You",
          speech:
            "This darkroom explains how someone could obtain cyanide without suspicion. Professor Hayes, you've been developing photographs here?",
        },
        {
          character: "Professor Hayes",
          speech:
            "Yes, I brought my equipment for the research documentation. But I keep my chemicals locked up - they're dangerous.",
        },
        {
          character: "Martha",
          speech: "I found those letters in Mr. Blackwood's coat pocket. He seemed very upset about them at dinner.",
        },
      ],
      background_audio: "mystery",
      clues: [
        {
          clue_id: "darkroom_chemicals",
          name: "Darkroom Chemicals",
          description: "Professor Hayes had a photography darkroom with chemicals",
        },
        {
          clue_id: "threatening_letters",
          name: "Threatening Letters",
          description: "Letters expressing outrage about the Riverside project",
        },
        {
          clue_id: "cyanide_vial",
          name: "Cyanide Vial",
          description: "Small vial of potassium cyanide found in the kitchen",
        },
        { clue_id: "syringe", name: "Syringe", description: "Syringe that could have been used to inject poison" },
      ],
      options: [
        {
          option_id: "opt_6_1",
          description: "Confront Professor Hayes about the missing chemicals",
          next_scene: "scene_8",
        },
        {
          option_id: "opt_6_2",
          description: "Analyze the handwriting on the threatening letters",
          next_scene: "scene_7",
        },
        { option_id: "opt_6_3", description: "Test the syringe for fingerprints", next_scene: "scene_9" },
        { option_id: "opt_6_4", description: "Question everyone about the Riverside project", next_scene: "scene_10" },
      ],
    },
    {
      scene_id: "scene_7",
      narration:
        "Your analysis of the threatening letters and the fireplace ash reveals a complex web of deception that brings you closer to identifying the killer. The handwriting analysis shows that while the letters appear to be from different people, subtle similarities in letter formation and pen pressure suggest they were all written by the same person attempting to disguise their writing. In the fireplace ash, you discover the remains of additional documents - partially burned pages that appear to be financial records and what looks like a blackmail note demanding payment to keep certain information secret. Tom Bradley's tool kit, when examined closely, contains traces of the same ash found in the fireplace, suggesting he may have been involved in burning evidence. Tom's nervous behavior becomes more pronounced as you question him, and you notice his hands shake slightly when he handles his tools. However, a closer examination of his work schedule shows he was genuinely in the basement during the murder, as evidenced by the half-completed plumbing repair and wet footprints leading from the basement to his room. The real revelation comes when you match the handwriting samples - the threatening letters were written by someone trying to frame multiple people, creating false evidence to muddy the investigation.",
      dialogues: [
        {
          character: "You",
          speech: "These letters were all written by the same person. Someone wanted to create multiple suspects.",
        },
        {
          character: "Tom Bradley",
          speech: "I... I burned some papers for someone. They said it was just old business documents.",
        },
        { character: "You", speech: "Who asked you to burn the papers, Tom? This is crucial information." },
        {
          character: "Tom",
          speech:
            "It was... it was Dr. Chen. She said they were old patient files that needed to be destroyed properly.",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "forged_letters",
          name: "Forged Letters",
          description: "All threatening letters were written by the same person",
        },
        {
          clue_id: "burned_evidence",
          name: "Burned Evidence",
          description: "Additional burned documents found in the fireplace ash",
        },
        {
          clue_id: "tom_innocent",
          name: "Tom Innocent",
          description: "Tom was genuinely in the basement during the murder",
        },
        { clue_id: "chen_suspicious", name: "Chen Suspicious", description: "Dr. Chen asked Tom to burn papers" },
      ],
      options: [
        { option_id: "opt_7_1", description: "Confront Dr. Chen about the burned documents", next_scene: "scene_8" },
        { option_id: "opt_7_2", description: "Investigate Dr. Chen's medical bag", next_scene: "scene_9" },
        { option_id: "opt_7_3", description: "Check if Dr. Chen had access to the study", next_scene: "scene_10" },
        { option_id: "opt_7_4", description: "Gather all evidence against Dr. Chen", next_scene: "scene_8" },
      ],
    },
    {
      scene_id: "scene_8",
      narration:
        "Dr. Elizabeth Chen's composed facade begins to crack under the weight of mounting evidence as you confront her in the privacy of the lodge's library. Her medical bag, when searched with her reluctant permission, contains not only standard medical supplies but also a small bottle of potassium cyanide labeled as 'emergency antidote supplies' - a clever cover story that would explain its presence if discovered. Your questioning reveals that Dr. Chen had been treating Jonathan Blackwood for severe anxiety and depression related to the Riverside project, giving her intimate knowledge of his evening routine and his dependence on brandy to sleep. She admits to writing the threatening letters as a psychological experiment to study fear responses, but her explanation becomes increasingly convoluted and defensive. The breakthrough comes when you present the burned financial documents - they show that Dr. Chen had invested her entire retirement savings in properties that would be demolished for the Riverside development, and Jonathan had refused to modify his plans despite her desperate pleas. Faced with financial ruin and professional disgrace, she had planned the perfect murder, using her medical knowledge and the isolated lodge setting to eliminate the man who had destroyed her future.",
      dialogues: [
        {
          character: "Dr. Chen",
          speech:
            "You don't understand the pressure I was under. Jonathan was going to destroy everything I'd worked for.",
        },
        {
          character: "You",
          speech:
            "So you used your medical knowledge to poison him, then tried to frame others with fake threatening letters.",
        },
        {
          character: "Dr. Chen",
          speech:
            "It wasn't supposed to happen like this. I just wanted him to reconsider the project. The cyanide was meant to be a warning.",
        },
        {
          character: "You",
          speech: "A warning? Dr. Chen, you administered a lethal dose. This was premeditated murder.",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "chen_confession",
          name: "Chen Confession",
          description: "Dr. Chen admits to writing threatening letters and poisoning Jonathan",
        },
        {
          clue_id: "financial_motive",
          name: "Financial Motive",
          description: "Dr. Chen invested in properties that would be demolished for the Riverside project",
        },
        {
          clue_id: "medical_knowledge",
          name: "Medical Knowledge",
          description: "Dr. Chen had knowledge of medical supplies and cyanide",
        },
        { clue_id: "premeditation", name: "Premeditation", description: "Dr. Chen planned the murder in advance" },
      ],
      options: [
        { option_id: "opt_8_1", description: "Arrest Dr. Chen for murder", next_scene: "scene_9" },
        { option_id: "opt_8_2", description: "Get a full confession with details", next_scene: "scene_10" },
        { option_id: "opt_8_3", description: "Confront her with all the evidence", next_scene: "scene_9" },
      ],
    },
    {
      scene_id: "scene_9",
      narration:
        "The final pieces of the puzzle fall into place as Dr. Elizabeth Chen, faced with overwhelming evidence, provides a complete confession that reveals the calculated nature of her crime. She explains how she had been planning the murder for weeks, using her position as Jonathan's therapist to learn his habits and vulnerabilities. The evening of the murder, she had excused herself from the group after dinner, claiming to need something from her room, but instead went to the kitchen where she used the syringe to inject cyanide into Jonathan's brandy bottle. She then returned to the main hall and waited, knowing that Martha would discover the body when she brought the evening drink. Her plan was to let suspicion fall on the business partners and family members who had obvious motives, while she remained above suspicion as a respected medical professional. The threatening letters were meant to suggest a conspiracy of enemies, and she had manipulated Tom Bradley into burning additional evidence by claiming they were confidential patient files. As you place her under arrest, the other guests watch in stunned silence, finally understanding how close they had all come to being framed for a crime they didn't commit. The storm continues to rage outside, but inside Pine Ridge Lodge, justice has been served and the truth has been revealed.",
      dialogues: [
        {
          character: "Dr. Chen",
          speech:
            "I spent thirty years building my practice, my reputation, my savings. Jonathan was going to take it all away with one signature.",
        },
        {
          character: "You",
          speech:
            "So you decided to take his life instead. The irony is that as his therapist, you were supposed to help him, not kill him.",
        },
        {
          character: "Sarah Blackwood",
          speech: "My father had his faults, but he didn't deserve to die like this. How could you betray his trust?",
        },
        {
          character: "Dr. Chen",
          speech: "I'm sorry, Sarah. I truly am. But I couldn't let him destroy so many lives for his profit.",
        },
      ],
      background_audio: "mystery",
      clues: [
        {
          clue_id: "full_confession",
          name: "Full Confession",
          description: "Dr. Chen provides a complete confession about the murder",
        },
        { clue_id: "arrest_made", name: "Arrest Made", description: "Dr. Chen is placed under arrest" },
        { clue_id: "case_solved", name: "Case Solved", description: "The murder case is successfully solved" },
      ],
      options: [
        { option_id: "opt_9_1", description: "Case closed - Dr. Chen arrested for murder", next_scene: "scene_10" },
      ],
    },
    {
      scene_id: "scene_10",
      narration:
        "As dawn breaks over Pine Ridge Lodge, the storm finally begins to subside, and the first rescue vehicles can be seen making their way up the mountain road through the clearing snow. Dr. Elizabeth Chen sits in custody, her medical career and freedom forfeit for a crime born of desperation and greed. The other guests, shaken but relieved, begin to process the events of the night and their narrow escape from being wrongfully accused. Jonathan Blackwood's death, while tragic, has been solved through careful detective work and the inexorable power of truth. Sarah Blackwood, despite her complicated relationship with her father, finds some closure in knowing that his killer has been brought to justice. The Riverside development project will likely be cancelled now, ironically achieving what Dr. Chen had wanted but through the worst possible means. As you prepare to leave Pine Ridge Lodge with your prisoner, you reflect on how isolation and desperation can drive even respected professionals to commit the ultimate crime. The lodge will return to its peaceful existence, but the events of this snowy night will be remembered as a stark reminder that murder can happen anywhere, and that justice, like the mountain dawn, will always find a way to break through even the darkest storms.",
      dialogues: [
        {
          character: "Martha",
          speech:
            "Thank you, Detective Hayes. I don't know how we would have survived not knowing who among us was the killer.",
        },
        {
          character: "You",
          speech: "The truth has a way of revealing itself, even in the most challenging circumstances.",
        },
        { character: "Sarah Blackwood", speech: "Will the Riverside project be stopped now?" },
        {
          character: "You",
          speech:
            "That's not for me to decide, but I suspect your father's death will change many things about that development.",
        },
      ],
      background_audio: "mystery",
      clues: [
        { clue_id: "case_concluded", name: "Case Concluded", description: "The murder case is concluded" },
        { clue_id: "justice_served", name: "Justice Served", description: "Dr. Chen is arrested for murder" },
      ],
      options: [{ option_id: "opt_10_1", description: "End: Case successfully solved", next_scene: null }],
    },
  ],
}

interface Dialogue {
  character: string
  speech: string
}

interface Clue {
  clue_id: string
  name: string
  description: string
}

interface Option {
  option_id: string
  description: string
  next_scene: string | null
  required_clues?: string[]
}

interface Scene {
  scene_id: string
  narration: string
  dialogues: Dialogue[]
  background_audio: string
  clues: Clue[]
  options: Option[]
}

export default function SnowyLodgePage() {
  const router = useRouter()
  const [currentScene, setCurrentScene] = useState("scene_1")
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([])
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1"])

  const scene = storyData.scenes.find((s) => s.scene_id === currentScene)

  useEffect(() => {
    if (scene?.clues) {
      setDiscoveredClues((prev) => {
        const existingIds = prev.map((c) => c.clue_id)
        const newClues = scene.clues.filter((c) => !existingIds.includes(c.clue_id))
        return [...prev, ...newClues]
      })
    }
  }, [currentScene, scene])

  const handleOptionClick = (nextScene: string | null) => {
    if (nextScene) {
      setCurrentScene(nextScene)
      setSceneHistory((prev) => [...prev, nextScene])
    }
  }

  const handleBackClick = () => {
    if (sceneHistory.length > 1) {
      const newHistory = sceneHistory.slice(0, -1)
      const previousScene = newHistory[newHistory.length - 1]
      setSceneHistory(newHistory)
      setCurrentScene(previousScene)
    }
  }

  if (!scene) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center text-white">
        Scene not found
      </div>
    )
  }

  return (
    <div className="case-container">
      {/* Snow effect background */}
      <div className="snow-overlay">
        <div className="snowflake snowflake-1">
          <Snowflake className="w-4 h-4 text-white" />
        </div>
        <div className="snowflake snowflake-2">
          <Snowflake className="w-3 h-3 text-blue-200" />
        </div>
        <div className="snowflake snowflake-3">
          <Snowflake className="w-5 h-5 text-slate-300" />
        </div>
        <div className="snowflake snowflake-4">
          <Snowflake className="w-4 h-4 text-white" />
        </div>
        <div className="snowflake snowflake-5">
          <Snowflake className="w-3 h-3 text-blue-100" />
        </div>
        <div className="snowflake snowflake-6">
          <Snowflake className="w-4 h-4 text-slate-200" />
        </div>
      </div>

      <div className="scene-content">
        {/* Header */}
        <div className="case-header">
          <div className="header-title">
            <Mountain className="w-8 h-8 text-blue-300" />
            <h1>The Pine Ridge Lodge Mystery</h1>
            <Mountain className="w-8 h-8 text-blue-300" />
          </div>
          <p className="subtitle">A Locked-Room Murder in the Mountains</p>
        </div>

        {/* Previous Scene button */}
        {sceneHistory.length > 1 && (
          <button onClick={handleBackClick} className="scene-back-button">
            <ChevronLeft className="w-4 h-4" />
            Previous Scene
          </button>
        )}

        {/* Scene content */}
        <div className="scene-box">
          <div className="scene-narration">
            <h2 className="scene-title">Scene {currentScene.split("_")[1]}</h2>
            <p className="narration">{scene.narration}</p>
          </div>

          {/* Dialogues */}
          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3 className="section-title">Conversations:</h3>
              {scene.dialogues.map((dialogue, index) => (
                <div key={index} className="dialogue-item">
                  <p className="speaker-name">{dialogue.character}:</p>
                  <p className="dialogue-text">"{dialogue.speech}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Clues discovered */}
          {scene.clues && scene.clues.length > 0 && (
            <div className="clues-section">
              <h3 className="section-title">Evidence Discovered:</h3>
              <div className="clues-grid">
                {scene.clues.map((clue, index) => (
                  <span key={index} className="clue-tag" title={clue.description}>
                    {clue.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Options */}
          <div className="options-section">
            <h3 className="section-title">Your Next Move:</h3>
            <div className="options-grid">
              {scene.options.map((option, index) => (
                <button key={index} onClick={() => handleOptionClick(option.next_scene)} className="option-btn">
                  {option.description}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clues sidebar */}
        {discoveredClues.length > 0 && (
          <div className="evidence-sidebar">
            <h3 className="sidebar-title">Evidence Collected:</h3>
            <div className="evidence-grid">
              {discoveredClues.map((clue, index) => (
                <span key={index} className="evidence-tag" title={clue.description}>
                  {clue.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Return to Cases button - positioned at bottom-left */}
      <button onClick={() => router.back()} className="back-button">
        <ArrowLeft className="w-4 h-4" />
        Return to Cases
      </button>

      <style jsx>{`
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #312e81 100%);
          color: #f1f5f9;
          font-family: "Inter", sans-serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }

        .snow-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .snowflake {
          position: absolute;
          animation: snowfall 8s linear infinite;
        }

        .snowflake-1 { top: -10px; left: 10%; animation-delay: 0s; }
        .snowflake-2 { top: -10px; left: 30%; animation-delay: 2s; }
        .snowflake-3 { top: -10px; left: 50%; animation-delay: 4s; }
        .snowflake-4 { top: -10px; left: 70%; animation-delay: 1s; }
        .snowflake-5 { top: -10px; left: 20%; animation-delay: 3s; }
        .snowflake-6 { top: -10px; left: 80%; animation-delay: 5s; }

        @keyframes snowfall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        .scene-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(30, 58, 138, 0.3);
          border-radius: 15px;
          border: 2px solid #3b82f6;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
        }

        .header-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .case-header h1 {
          font-size: 2.8rem;
          margin: 0;
          color: #dbeafe;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          font-weight: 700;
        }

        .subtitle {
          color: #93c5fd;
          font-size: 1.2rem;
          font-style: italic;
          margin: 0;
        }

        .scene-back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(71, 85, 105, 0.5);
          color: #e2e8f0;
          border: 2px solid #475569;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
          align-self: flex-start;
        }

        .scene-back-button:hover {
          background: #475569;
          color: white;
          transform: translateX(-3px);
          box-shadow: 0 4px 15px rgba(71, 85, 105, 0.4);
        }

        .scene-box {
          background: rgba(30, 41, 59, 0.8);
          padding: 30px;
          border-radius: 15px;
          border: 2px solid #475569;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }

        .scene-title {
          font-size: 2rem;
          margin: 0 0 20px 0;
          color: #dbeafe;
          font-weight: 600;
        }

        .narration {
          font-size: 1.2rem;
          line-height: 1.7;
          color: #f1f5f9;
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 1.4rem;
          color: #93c5fd;
          margin: 25px 0 15px 0;
          font-weight: 600;
        }

        .dialogue-section {
          margin: 25px 0;
        }

        .dialogue-item {
          background: rgba(59, 130, 246, 0.15);
          padding: 18px;
          border-radius: 10px;
          border-left: 4px solid #3b82f6;
          margin: 12px 0;
        }

        .speaker-name {
          font-weight: bold;
          color: #dbeafe;
          margin: 0 0 8px 0;
          font-size: 1.1rem;
        }

        .dialogue-text {
          font-style: italic;
          color: #f1f5f9;
          margin: 0;
          font-size: 1.05rem;
        }

        .clues-section {
          margin: 25px 0;
        }

        .clues-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .clue-tag {
          padding: 8px 16px;
          background: rgba(59, 130, 246, 0.3);
          color: #dbeafe;
          border-radius: 20px;
          font-size: 0.9rem;
          border: 1px solid #3b82f6;
        }

        .options-section {
          margin: 25px 0 0 0;
        }

        .options-grid {
          display: grid;
          gap: 15px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .option-btn {
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          color: white;
          border: none;
          padding: 18px 24px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .option-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
        }

        .evidence-sidebar {
          background: rgba(30, 41, 59, 0.9);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #60a5fa;
          box-shadow: 0 8px 32px rgba(96, 165, 250, 0.2);
          backdrop-filter: blur(10px);
        }

        .sidebar-title {
          color: #dbeafe;
          margin: 0 0 18px 0;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
        }

        .evidence-tag {
          background: rgba(96, 165, 250, 0.2);
          padding: 10px;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          border: 1px solid #60a5fa;
          color: #f1f5f9;
        }

        .back-button {
          position: fixed;
          bottom: 25px;
          left: 25px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 2px solid #3b82f6;
          color: #dbeafe;
          padding: 15px 25px;
          border-radius: 30px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .back-button:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
        }

        @media (max-width: 768px) {
          .case-header h1 {
            font-size: 2.2rem;
          }

          .options-grid {
            grid-template-columns: 1fr;
          }

          .evidence-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }

          .case-container {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  )
}
