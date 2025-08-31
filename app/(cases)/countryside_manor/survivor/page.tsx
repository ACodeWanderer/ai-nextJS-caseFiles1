"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Mock data for the countryside manor case
const mockCaseData = {
  title: "The Countryside Manor Mystery",
  scenes: [
    {
      scene_id: "scene_1",
      narration:
        "Thick fog rolls across the Yorkshire moors as you arrive at Blackwood Manor, its tendrils clinging to the ancient stone walls like ghostly fingers. The Victorian estate looms through the mist, its windows glowing dimly in the evening gloom, casting long shadows across the overgrown gardens. Lord Blackwood has been found dead in his study after hosting what was meant to be a joyous family gathering. The servants whisper nervously in the corridors, their footsteps echoing through the grand halls that have witnessed generations of Blackwood secrets. As you step through the heavy oak doors, the weight of history and tragedy settles upon your shoulders like the manor's oppressive atmosphere. The very air seems to hold its breath, waiting for justice to be served in this place where old money and older grudges have finally collided with deadly consequences.",
      dialogues: [
        {
          character: "Inspector Hayes",
          speech:
            "The family claims they were all in the drawing room when they heard the gunshot. No one admits to entering the study.",
        },
        {
          character: "Detective",
          speech: "A house full of suspects and secrets. Let's begin our investigation.",
        },
      ],
      background_audio: "manor_ambience",
      options: [
        {
          option_id: "examine_study",
          description: "Examine the study where Lord Blackwood was found",
          next_scene: "scene_2",
          required_clues: [],
        },
        {
          option_id: "interview_family",
          description: "Interview the family members in the drawing room",
          next_scene: "scene_3",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_2",
      narration:
        "Lord Blackwood sits slumped in his leather chair, a revolver on the floor beside him, his lifeless eyes staring at the ceiling as if seeking answers from above. The study reeks of gunpowder and brandy, a potent mixture that speaks of violence and vice intertwined. Papers are scattered across his mahogany desk like fallen leaves, some bearing official seals and others covered in his distinctive handwriting. The window stands slightly ajar despite the cold fog outside, allowing wisps of mist to curl into the room like unwelcome spirits. Leather-bound books line the walls from floor to ceiling, silent witnesses to whatever transpired in this sanctuary of learning turned crime scene. The grandfather clock in the corner has stopped at precisely 9:47, as if time itself refused to continue after witnessing such a heinous act.",
      dialogues: [
        {
          character: "Detective",
          speech: "Curious... the window is open on such a cold, foggy night. And look at his hand position.",
        },
      ],
      background_audio: "crime_scene",
      clues: [
        {
          clue_id: "open_window",
          name: "Open Window",
          description:
            "The study window is open despite the cold, foggy weather. Fresh air circulation or escape route?",
        },
        {
          clue_id: "brandy_glass",
          name: "Half-Empty Brandy Glass",
          description:
            "A crystal brandy glass sits on the desk, still containing amber liquid. No fingerprints visible.",
        },
      ],
      options: [
        {
          option_id: "examine_papers",
          description: "Examine the scattered papers on the desk",
          next_scene: "scene_4",
          required_clues: [],
        },
        {
          option_id: "check_revolver",
          description: "Examine the revolver more closely",
          next_scene: "scene_5",
          required_clues: [],
        },
        {
          option_id: "go_to_family",
          description: "Go interview the family",
          next_scene: "scene_3",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_3",
      narration:
        "The family sits in uncomfortable silence in the grand drawing room, their faces pale and drawn in the flickering light of the ornate chandelier. Lady Blackwood dabs her eyes with a lace handkerchief, her aristocratic composure cracking like fine porcelain under pressure. Her son Edward paces by the fireplace like a caged animal, his footsteps muffled by the Persian carpet that has absorbed decades of family secrets. Daughter Margaret sits rigidly upright in her chair, her spine straight as a poker, every muscle tense with barely contained emotion. The family lawyer, Mr. Pemberton, nervously adjusts his spectacles with trembling fingers, his usually immaculate appearance disheveled by the evening's shocking events. The very walls seem to press in upon them, heavy with the weight of unspoken accusations and long-buried resentments that have finally surfaced in the wake of tragedy.",
      dialogues: [
        {
          character: "Lady Blackwood",
          speech:
            "My husband seemed troubled lately. He'd been receiving strange letters and making secretive phone calls.",
        },
        {
          character: "Edward Blackwood",
          speech:
            "Father was planning to change his will. He told me so yesterday. Said someone in this family didn't deserve their inheritance.",
        },
        {
          character: "Margaret Blackwood",
          speech:
            "That's preposterous! Father would never disinherit any of us. Edward, you're being dramatic as usual.",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "will_change",
          name: "Planned Will Change",
          description: "Lord Blackwood intended to change his will, potentially disinheriting someone in the family.",
        },
      ],
      options: [
        {
          option_id: "question_edward",
          description: "Question Edward about his father's plans",
          next_scene: "scene_6",
          required_clues: [],
        },
        {
          option_id: "question_margaret",
          description: "Question Margaret about family tensions",
          next_scene: "scene_7",
          required_clues: [],
        },
        {
          option_id: "question_lawyer",
          description: "Question Mr. Pemberton about the will",
          next_scene: "scene_8",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_4",
      narration:
        "Among the scattered papers, you find financial documents, correspondence, and what appears to be a draft of a new will, all bearing the unmistakable signs of urgent, recent activity. One letter stands out like a beacon in the chaos - it's from a private investigator reporting on someone's gambling debts, the letterhead embossed with gold that catches the lamplight. The handwriting is precise and methodical, detailing a web of financial ruin that would destroy any respectable family's reputation. Bank statements show alarming withdrawals and transfers, painting a picture of desperation that grows clearer with each document you examine. The ink on some papers is still wet, suggesting Lord Blackwood was working on these matters mere hours before his death. A magnifying glass lies nearby, evidence of the meticulous investigation the lord was conducting into his own family's affairs, unaware that his discoveries would cost him his life.",
      dialogues: [
        {
          character: "Detective",
          speech: "Interesting... someone in this family has been living beyond their means. This could be our motive.",
        },
      ],
      background_audio: "discovery",
      clues: [
        {
          clue_id: "gambling_debts",
          name: "Private Investigator's Report",
          description:
            "A report detailing someone's substantial gambling debts and financial troubles. The name is partially obscured by a coffee stain.",
        },
        {
          clue_id: "new_will_draft",
          name: "Draft Will",
          description: "A handwritten draft of a new will that would significantly reduce one heir's inheritance.",
        },
      ],
      options: [
        {
          option_id: "analyze_handwriting",
          description: "Analyze the handwriting on the will",
          next_scene: "scene_9",
          required_clues: [],
        },
        {
          option_id: "confront_family",
          description: "Confront the family about the gambling debts",
          next_scene: "scene_6",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_5",
      narration:
        "The revolver is Lord Blackwood's own - a family heirloom passed down through generations, its silver barrel engraved with the family crest that now seems to mock the tragedy it has witnessed. But something seems fundamentally wrong about how it's positioned, lying at an unnatural angle that suggests haste rather than careful placement. The angle suggests it was dropped rather than placed, and there are powder burns on his right hand, though he was left-handed - a detail that sends a chill down your spine. The weapon's chamber shows one bullet fired, but the trajectory doesn't align with a self-inflicted wound. Closer inspection reveals fingerprints on the grip that appear smudged, as if someone tried to wipe them clean but failed to remove all traces. The very air around the weapon seems charged with the violence it has perpetrated, and you realize this scene has been carefully staged to deceive.",
      dialogues: [
        {
          character: "Detective",
          speech:
            "Wait... Lord Blackwood was left-handed, but the powder burns are on his right hand. This wasn't suicide.",
        },
      ],
      background_audio: "revelation",
      clues: [
        {
          clue_id: "wrong_hand",
          name: "Powder Burns on Wrong Hand",
          description:
            "Powder burns on Lord Blackwood's right hand, despite him being left-handed. Clear evidence this wasn't suicide.",
        },
        {
          clue_id: "family_revolver",
          name: "Family Heirloom Revolver",
          description: "The murder weapon belongs to the Blackwood family - someone with access to the gun cabinet.",
        },
      ],
      options: [
        {
          option_id: "check_gun_cabinet",
          description: "Check who had access to the gun cabinet",
          next_scene: "scene_8",
          required_clues: [],
        },
        {
          option_id: "return_to_family",
          description: "Return to question the family with new evidence",
          next_scene: "scene_6",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_6",
      narration:
        "Edward becomes increasingly defensive when questioned further, his aristocratic facade crumbling like ancient mortar under pressure. His hands shake as he lights a cigarette, the flame dancing wildly in his trembling grasp, betraying nerves that his words try desperately to conceal. You notice mud on his shoes despite his adamant claims that he never left the drawing room, the dark earth still damp and clinging to the expensive leather. The contradiction hangs in the air like smoke, impossible to ignore and equally impossible for him to explain away convincingly. His eyes dart nervously toward the window, as if calculating escape routes or remembering something he'd rather forget. The very way he holds himself speaks of guilt, though whether it's the guilt of murder or merely the shame of being caught in a lie remains to be determined.",
      dialogues: [
        {
          character: "Edward Blackwood",
          speech:
            "I... I may have stepped outside for some air. The fog was so thick, I could barely see the garden path.",
        },
        {
          character: "Detective",
          speech: "Yet you claim you were in the drawing room when the shot was fired. Which is it, Mr. Blackwood?",
        },
      ],
      background_audio: "interrogation",
      clues: [
        {
          clue_id: "muddy_shoes",
          name: "Edward's Muddy Shoes",
          description:
            "Edward has mud on his shoes despite claiming he stayed indoors all evening. False clue - the mud is from the garden, not relevant to the murder.",
        },
      ],
      options: [
        {
          option_id: "press_edward",
          description: "Press Edward about his whereabouts",
          next_scene: "scene_9",
          required_clues: [],
        },
        {
          option_id: "question_others",
          description: "Question the other family members",
          next_scene: "scene_7",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_7",
      narration:
        "Margaret appears composed on the surface, but her knuckles are white as bone as she grips her delicate teacup, the porcelain threatening to shatter under the pressure. When asked about her relationship with her father, her carefully constructed facade begins to crack like ice under spring sun. Her breathing becomes shallow and rapid, and a slight tremor runs through her voice despite her attempts to maintain aristocratic dignity. The firelight plays across her face, revealing the tracks of tears she thought she had successfully hidden from view. Her posture remains rigid, but you can see the internal struggle playing out in her eyes - the battle between loyalty to family and the desperate need to unburden herself of terrible secrets. The very air around her seems to vibrate with suppressed emotion, as if the truth is fighting to break free from the prison of her composed exterior.",
      dialogues: [
        {
          character: "Margaret Blackwood",
          speech:
            "Father was... difficult. He disapproved of my engagement to Charles. Said he'd cut me off if I married beneath my station.",
        },
        {
          character: "Detective",
          speech: "That must have been very upsetting. Did you argue with him tonight?",
        },
        {
          character: "Margaret Blackwood",
          speech: "We... we had words before dinner. But I would never... I couldn't...",
        },
      ],
      background_audio: "emotional",
      clues: [
        {
          clue_id: "engagement_dispute",
          name: "Engagement Dispute",
          description:
            "Margaret was threatened with disinheritance over her engagement to someone her father deemed unsuitable.",
        },
      ],
      options: [
        {
          option_id: "investigate_engagement",
          description: "Investigate Margaret's engagement",
          next_scene: "scene_8",
          required_clues: [],
        },
        {
          option_id: "check_timeline",
          description: "Verify the timeline of events",
          next_scene: "scene_9",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_8",
      narration:
        "Mr. Pemberton, the family lawyer, reveals crucial information about the will and the family's financial situation, his professional composure finally cracking under the weight of terrible knowledge. His nervous demeanor suggests he knows far more than he's been letting on, and beads of perspiration form on his brow despite the manor's chill. The man who has served the Blackwood family faithfully for three decades now finds himself at the center of a web of deceit that threatens to destroy everything he has worked to build. His hands tremble as he removes his spectacles to clean them, a nervous habit that betrays his inner turmoil. The legal documents spread before him tell a story of financial irregularities that would shock even the most jaded observer. As he speaks, his voice wavers between professional detachment and personal anguish, revealing a man torn between duty and self-preservation.",
      dialogues: [
        {
          character: "Mr. Pemberton",
          speech:
            "Lord Blackwood asked me to prepare a new will last week. He discovered that someone had been... borrowing from the estate accounts without permission.",
        },
        {
          character: "Detective",
          speech: "Borrowing? You mean embezzling. Who had access to these accounts?",
        },
        {
          character: "Mr. Pemberton",
          speech:
            "Only family members and myself. But I've been the family lawyer for thirty years - my reputation is spotless!",
        },
      ],
      background_audio: "revelation",
      clues: [
        {
          clue_id: "embezzlement",
          name: "Estate Embezzlement",
          description:
            "Someone with access to the estate accounts has been stealing money. This was discovered recently by Lord Blackwood.",
        },
        {
          clue_id: "lawyer_access",
          name: "Account Access List",
          description:
            "Only family members and Mr. Pemberton had access to the estate accounts that were being embezzled from.",
        },
      ],
      options: [
        {
          option_id: "accuse_lawyer",
          description: "Accuse Mr. Pemberton of embezzlement",
          next_scene: "scene_10",
          required_clues: [],
        },
        {
          option_id: "investigate_further",
          description: "Investigate which family member had financial troubles",
          next_scene: "scene_9",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_9",
      narration:
        "As you piece together the evidence with the methodical precision of a master craftsman, a clearer picture emerges from the fog of deception that has shrouded this case. The muddy shoes were indeed a red herring - Edward was in the garden, but for an innocent reason that has nothing to do with his father's murder. The real killer had both motive and opportunity, moving through the manor like a shadow while the family gathered in apparent unity. Each clue falls into place with the satisfying click of a well-oiled mechanism, revealing a pattern of greed and desperation that culminated in cold-blooded murder. The timeline becomes crystal clear as you eliminate the false leads and focus on the damning evidence that points to one inescapable conclusion. In the flickering candlelight of the manor, truth finally begins to emerge from the darkness that has consumed the Blackwood family.",
      dialogues: [
        {
          character: "Detective",
          speech:
            "The gambling debts, the embezzlement, the planned will change... it all points to one person who had everything to lose.",
        },
      ],
      background_audio: "realization",
      clues: [
        {
          clue_id: "timeline_verified",
          name: "Verified Timeline",
          description:
            "Edward's alibi checks out - he was in the garden smoking when the shot was fired. The muddy shoes were a false clue.",
        },
      ],
      options: [
        {
          option_id: "solve_case",
          description: "Reveal the true killer",
          next_scene: "scene_10",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_10",
      narration:
        "You gather everyone in the study for the final revelation, the very room where Lord Blackwood drew his last breath now serving as the stage for justice. The fog outside has lifted, and moonlight streams through the open window like a divine spotlight illuminating the truth that has been hidden in shadow. The family members file in with reluctant steps, their faces pale with dread and anticipation of what is to come. Mr. Pemberton enters last, his shoulders sagging under the weight of his guilt, knowing that his carefully constructed facade is about to crumble. The grandfather clock begins to chime midnight, its deep tones echoing through the manor like a funeral bell tolling for the dead. As you prepare to speak, the very walls seem to lean in, eager to finally hear the truth that has been festering within them like a cancer.",
      dialogues: [
        {
          character: "Detective",
          speech:
            "Ladies and gentlemen, Lord Blackwood was murdered by someone he trusted completely - someone who had been stealing from the family for years and faced exposure.",
        },
        {
          character: "Detective",
          speech:
            "Mr. Pemberton, you've been embezzling from the estate accounts. When Lord Blackwood discovered your theft and planned to change his will to remove you as executor, you killed him to protect your secret.",
        },
        {
          character: "Mr. Pemberton",
          speech: "You can't prove anything! It could have been any of them!",
        },
        {
          character: "Detective",
          speech:
            "The powder burns on his right hand prove it wasn't suicide. You staged it to look like one, but forgot he was left-handed. Only you had the legal knowledge to forge documents and access to cover your embezzlement.",
        },
      ],
      background_audio: "resolution",
      options: [
        {
          option_id: "case_solved",
          description: "Case Solved - Arrest Mr. Pemberton",
          next_scene: "ending",
          required_clues: [],
        },
      ],
    },
  ],
}

export default function CountrysideManorPage() {
  const [currentScene, setCurrentScene] = useState("scene_1")
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([])
  const [caseData, setCaseData] = useState(mockCaseData)
  const [isLoading, setIsLoading] = useState(false)
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1"])
  const router = useRouter()

  useEffect(() => {
    const fetchCaseData = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/case", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch case data")
        const data = await res.json()
        setCaseData(data)
      } catch {
        // Fallback to local mock if API fails
        setCaseData(mockCaseData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseData()
  }, [])

  const getCurrentSceneData = () => {
    return caseData.scenes.find((scene) => scene.scene_id === currentScene)
  }

  const handleOptionClick = (option: any) => {
    if (option.required_clues) {
      const hasRequiredClues = option.required_clues.every((clue: string) => discoveredClues.includes(clue))
      if (!hasRequiredClues) {
        alert("You need more evidence before choosing this option!")
        return
      }
    }

    const scene = getCurrentSceneData()
    if (scene?.clues) {
      const newClues = scene.clues.map((clue) => clue.clue_id)
      setDiscoveredClues((prev) => [...new Set([...prev, ...newClues])])
    }

    if (option.next_scene === "ending") {
      alert(
        "Case Solved! Mr. Pemberton murdered Lord Blackwood to cover up years of embezzlement from the estate accounts.",
      )
      return
    }

    setSceneHistory((prev) => [...prev, option.next_scene])
    setCurrentScene(option.next_scene)
  }

  const handlePreviousScene = () => {
    if (sceneHistory.length > 1) {
      const newHistory = [...sceneHistory]
      newHistory.pop()
      const previousScene = newHistory[newHistory.length - 1]
      setSceneHistory(newHistory)
      setCurrentScene(previousScene)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Entering the foggy manor...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #1a2332, #2d3748);
            color: #e2e8f0;
            font-family: "Crimson Text", serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(139, 69, 19, 0.3);
            border-top: 3px solid #8b4513;
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
    )
  }

  const scene = getCurrentSceneData()

  if (!scene) {
    return (
      <div className="error-screen">
        <h2>Scene not found</h2>
        <Link href="/detective">Return to Detective</Link>
      </div>
    )
  }

  return (
    <>
      <div className="case-container">
        <div className="fog-overlay"></div>

        {sceneHistory.length > 1 && (
          <button className="previous-scene-button" onClick={handlePreviousScene}>
            ← Previous Scene
          </button>
        )}

        <div className="case-header">
          <h1>{caseData.title}</h1>
          <div className="clues-counter">Evidence Collected: {discoveredClues.length}</div>
        </div>

        <div className="scene-content">
          <div className="narration-box">
            <h3>🏰 Scene</h3>
            <p className="narration">{scene.narration}</p>
          </div>

          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3>💬 Dialogue</h3>
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
              <h3>🔍 Evidence Discovered</h3>
              {scene.clues.map((clue, index) => (
                <div key={index} className="clue-item">
                  <strong>{clue.name}</strong>
                  <p>{clue.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="options-section">
            <h3>🤔 Your Next Move</h3>
            <div className="options-grid">
              {scene.options.map((option, index) => {
                const isDisabled =
                  option.required_clues &&
                  !option.required_clues.every((clue: string) => discoveredClues.includes(clue))

                return (
                  <button
                    key={index}
                    className={`option-btn ${isDisabled ? "disabled" : ""}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={isDisabled}
                  >
                    {option.description}
                    {isDisabled && <span className="locked-icon">🔒</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {discoveredClues.length > 0 && (
          <div className="evidence-sidebar">
            <h3>📋 Case File</h3>
            <div className="evidence-list">
              {discoveredClues.map((clueId, index) => {
                const clue = caseData.scenes.flatMap((s) => s.clues || []).find((c) => c.clue_id === clueId)
                return clue ? (
                  <div key={index} className="evidence-item">
                    <strong>{clue.name}</strong>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        <button className="back-button" onClick={() => router.back()}>
          ← Return to Cases
        </button>
      </div>

      <style jsx>{`
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a2332 0%, #2d3748 50%, #1a202c 100%);
          color: #e2e8f0;
          font-family: "Crimson Text", serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }

        .fog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
          animation: fogDrift 20s ease-in-out infinite;
        }

        @keyframes fogDrift {
          0%, 100% { opacity: 0.3; transform: translateX(0px); }
          50% { opacity: 0.6; transform: translateX(10px); }
        }

        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(139, 69, 19, 0.15);
          border-radius: 15px;
          border: 2px solid #8b4513;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }

        .case-header h1 {
          font-size: 2.8rem;
          margin: 0 0 10px 0;
          color: #d4af37;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          font-weight: 700;
        }

        .clues-counter {
          font-size: 1.2rem;
          color: #cd853f;
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
          background: rgba(45, 55, 72, 0.8);
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid #8b4513;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          backdrop-filter: blur(5px);
        }

        .narration-box h3,
        .dialogue-section h3,
        .clues-section h3,
        .options-section h3 {
          margin: 0 0 18px 0;
          color: #d4af37;
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
          background: rgba(139, 69, 19, 0.2);
          border-radius: 10px;
          border-left: 3px solid #cd853f;
        }

        .character-name {
          font-weight: bold;
          color: #d4af37;
          margin-right: 12px;
          font-size: 1.1rem;
        }

        .speech {
          font-style: italic;
          color: #e2e8f0;
        }

        .clues-section {
          border-left-color: #cd853f;
          background: rgba(205, 133, 63, 0.1);
        }

        .clue-item {
          background: rgba(212, 175, 55, 0.15);
          padding: 18px;
          border-radius: 10px;
          margin: 12px 0;
          border: 2px solid #cd853f;
          box-shadow: 0 2px 10px rgba(205, 133, 63, 0.2);
        }

        .clue-item strong {
          color: #d4af37;
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
          background: linear-gradient(45deg, #8b4513, #a0522d);
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
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
        }

        .option-btn:hover:not(.disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
          background: linear-gradient(45deg, #a0522d, #cd853f);
        }

        .option-btn.disabled {
          background: #4a5568;
          color: #a0aec0;
          cursor: not-allowed;
          box-shadow: none;
        }

        .locked-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 0.9rem;
        }

        .evidence-sidebar {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 280px;
          background: rgba(26, 32, 44, 0.95);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid #cd853f;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          backdrop-filter: blur(10px);
        }

        .evidence-sidebar h3 {
          color: #d4af37;
          margin: 0 0 18px 0;
          text-align: center;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .evidence-item {
          background: rgba(205, 133, 63, 0.15);
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          font-size: 0.95rem;
          border-left: 3px solid #cd853f;
        }

        .back-button {
          position: fixed;
          bottom: 25px;
          left: 25px;
          background-color: transparent;
          border: 2px solid #8b4513;
          color: #d4af37;
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
          background-color: #8b4513;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);
        }

        .previous-scene-button {
          position: fixed;
          top: 25px;
          left: 25px;
          background-color: transparent;
          border: 2px solid #8b4513;
          color: #d4af37;
          padding: 12px 20px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: "Crimson Text", serif;
          z-index: 1000;
          backdrop-filter: blur(10px);
          background: rgba(26, 32, 44, 0.8);
        }

        .previous-scene-button:hover {
          background-color: #8b4513;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);
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
  )
}
