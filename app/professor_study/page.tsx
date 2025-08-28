"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ArrowLeft, BookOpen, Search, Users, FileText } from "lucide-react"

interface Scene {
  scene_id: string
  narration: string
  dialogues: Array<{
    speaker: string
    text: string
  }>
  background_audio: string
  clues: string[]
  options: Array<{
    text: string
    next_scene: string
  }>
}

const mockStoryData: Scene[] = [
  {
    scene_id: "scene_1",
    narration:
      "The autumn rain patters against the tall windows of Whitmore University's Gothic library building, casting dancing shadows across the mahogany-paneled corridors. Professor Edmund Hartwell, the distinguished head of the Philosophy Department, has been found dead in his private study on this dreary October evening. The heavy oak door was locked from the inside, with no other apparent means of entry or exit. His body sits slumped over his antique writing desk, surrounded by scattered papers and an overturned teacup. The scene appears peaceful yet deeply unsettling, as if time itself has frozen in this scholarly sanctuary. Detective Inspector Sarah Morrison arrives to find the university in shock, with whispers of suicide, accident, or something far more sinister echoing through the hallowed halls.",
    dialogues: [
      {
        speaker: "Dr. Margaret Ashford (Dean)",
        text: "Inspector Morrison, thank you for coming so quickly. Professor Hartwell was... he was one of our most respected faculty members. This is absolutely devastating.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "I understand this is difficult, Dr. Ashford. Can you tell me who discovered the body and when?",
      },
      {
        speaker: "Dr. Margaret Ashford",
        text: "His research assistant, Thomas Chen, found him around 8 PM. Edmund had missed his evening lecture, which was highly unusual. Thomas used his spare key when there was no response to knocking.",
      },
    ],
    background_audio: "Soft rain against windows, distant university bells",
    clues: ["locked_door", "overturned_teacup", "scattered_papers"],
    options: [
      { text: "Examine the professor's study in detail", next_scene: "scene_2" },
      { text: "Interview Thomas Chen, the research assistant", next_scene: "scene_3" },
      { text: "Speak with university security about access logs", next_scene: "scene_4" },
    ],
  },
  {
    scene_id: "scene_2",
    narration:
      "Professor Hartwell's study is a testament to a lifetime of academic pursuit, with floor-to-ceiling bookshelves filled with philosophical treatises and classical literature. The air carries the lingering scent of pipe tobacco and old leather bindings, creating an atmosphere of scholarly contemplation. His body remains positioned at the desk, head resting on his left arm, with his right hand still clutching a fountain pen. A half-finished letter lies beneath his hand, the ink slightly smeared where his palm has rested. The overturned teacup has spilled its contents across several important-looking documents, and you notice the liquid has an unusual bitter almond scent. Most intriguingly, the room's single window is slightly ajar despite the cold rain, and there are no signs of struggle or forced entry anywhere in the study.",
    dialogues: [
      {
        speaker: "Detective Inspector Morrison",
        text: "The positioning suggests he was writing when he died. Let me examine this letter more closely.",
      },
      {
        speaker: "Forensics Officer",
        text: "Inspector, the tea definitely has traces of cyanide. But here's what's odd - the concentration seems inconsistent with typical poisoning cases.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "Inconsistent how? Too much or too little?",
      },
      {
        speaker: "Forensics Officer",
        text: "Too little, actually. This amount might cause illness, but death would be unlikely unless he had a severe underlying condition.",
      },
    ],
    background_audio: "Ticking grandfather clock, rustling papers",
    clues: ["unfinished_letter", "cyanide_traces", "open_window", "fountain_pen"],
    options: [
      { text: "Read the unfinished letter carefully", next_scene: "scene_5" },
      { text: "Investigate the open window and its significance", next_scene: "scene_6" },
      { text: "Question why the cyanide concentration is so low", next_scene: "scene_7" },
    ],
  },
  {
    scene_id: "scene_3",
    narration:
      "Thomas Chen, a nervous young man in his mid-twenties, sits in the university's faculty lounge wringing his hands as he recounts the evening's events. His thick-rimmed glasses fog slightly from anxiety, and his usually neat appearance shows signs of distress. He explains that Professor Hartwell had been acting strangely for the past few weeks, often staying late in his office and seeming preoccupied with something beyond his usual research. Thomas mentions that the professor had been receiving mysterious phone calls and had asked him to research information about certain pharmaceutical compounds. The young man's voice trembles as he describes finding his mentor's body, and you notice he keeps glancing toward the study as if expecting the professor to emerge at any moment. His account raises questions about whether Professor Hartwell might have been involved in something dangerous, or whether his death was part of a larger conspiracy.",
    dialogues: [
      {
        speaker: "Thomas Chen",
        text: "Professor Hartwell had been... different lately. Distracted, almost paranoid. He kept asking me to look up chemical compounds and their effects on the human body.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "What kind of compounds, Thomas? Can you be more specific?",
      },
      {
        speaker: "Thomas Chen",
        text: "Mostly plant-based toxins and their antidotes. He said it was for a paper he was writing on the philosophy of self-determination, but it seemed odd for a philosophy professor.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "Did he seem suicidal to you? Depressed or hopeless?",
      },
      {
        speaker: "Thomas Chen",
        text: "No, that's just it. He seemed... determined. Like he was preparing for something important.",
      },
    ],
    background_audio: "Quiet conversation, coffee brewing",
    clues: ["strange_behavior", "chemical_research", "mysterious_calls", "determined_mood"],
    options: [
      { text: "Ask Thomas about the mysterious phone calls", next_scene: "scene_8" },
      { text: "Investigate the professor's recent research activities", next_scene: "scene_9" },
      { text: "Return to examine the study with this new information", next_scene: "scene_2" },
    ],
  },
  {
    scene_id: "scene_4",
    narration:
      "The university's security office is a cramped space filled with monitors showing various campus locations, and the head of security, Robert Mills, pulls up the access logs with practiced efficiency. The electronic records show that Professor Hartwell entered his building at 2:30 PM using his keycard, but there's no record of him leaving. More intriguingly, the logs reveal that someone else accessed the building using an administrative override code at 7:45 PM, just fifteen minutes before Thomas Chen discovered the body. Mills explains that only five people have access to these override codes: the dean, the head of maintenance, the security chief, and two senior faculty members. The timing is suspicious, but Mills points out that the override was used to enter the building, not specifically the professor's study. Security cameras show the main entrances but not the individual office corridors, leaving a crucial gap in the timeline. The revelation that someone else was in the building so close to the time of death transforms the investigation from a potential suicide into something far more complex.",
    dialogues: [
      {
        speaker: "Robert Mills (Security Chief)",
        text: "Here's what's interesting, Inspector. Professor Hartwell's keycard shows entry at 2:30 PM, but no exit. That's not unusual - sometimes faculty forget to badge out.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "But someone used an administrative override at 7:45 PM. Who has access to those codes?",
      },
      {
        speaker: "Robert Mills",
        text: "Five people total. Dr. Ashford, myself, Jim Patterson from maintenance, and Professors Williams and Blackwood from the senior faculty.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "Can you tell which specific code was used?",
      },
      {
        speaker: "Robert Mills",
        text: "That's the problem - the system only logs that an override was used, not which specific code. Could have been any of the five.",
      },
    ],
    background_audio: "Humming computers, radio chatter",
    clues: ["override_access", "no_exit_record", "five_suspects", "timing_gap"],
    options: [
      { text: "Interview the five people with override access", next_scene: "scene_10" },
      { text: "Check if any security cameras captured the override user", next_scene: "scene_6" },
      { text: "Investigate why Professor Hartwell didn't badge out", next_scene: "scene_7" },
    ],
  },
  {
    scene_id: "scene_5",
    narration:
      "The unfinished letter on Professor Hartwell's desk is written in his distinctive handwriting, though the script becomes increasingly erratic toward the end, suggesting either emotional distress or physical impairment. The letter is addressed to 'My Dearest Colleagues' and begins as what appears to be a confession or explanation of some kind. He writes about 'the weight of knowledge' and 'the responsibility that comes with understanding the truth about human nature.' The most chilling passage reads: 'I have discovered something that challenges everything we believe about free will and moral responsibility, but the cost of this knowledge may be too great to bear.' The letter breaks off mid-sentence with the words 'The only ethical choice remaining is to...' followed by an ink blot where his hand apparently stopped moving. The philosophical nature of the content suggests this might be a suicide note, but the incomplete nature and the strange phrasing leave room for doubt. Could this be evidence of his intention to end his life, or was he interrupted while writing something entirely different?",
    dialogues: [
      {
        speaker: "Detective Inspector Morrison",
        text: "This reads like a suicide note, but something feels off about it. The handwriting deteriorates, but not in a way consistent with someone taking poison.",
      },
      {
        speaker: "Handwriting Expert",
        text: "You're right to be suspicious. The degradation pattern suggests external pressure or stress, not the typical effects of cyanide poisoning.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "External pressure? You mean someone might have been forcing him to write this?",
      },
      {
        speaker: "Handwriting Expert",
        text: "It's possible. Or he could have been writing under extreme emotional duress. The tremor patterns are inconsistent with his normal writing style.",
      },
    ],
    background_audio: "Paper rustling, pen scratching",
    clues: ["confession_letter", "deteriorating_handwriting", "incomplete_message", "philosophical_content"],
    options: [
      { text: "Analyze what 'truth about human nature' might refer to", next_scene: "scene_8" },
      { text: "Investigate if someone forced him to write this", next_scene: "scene_9" },
      { text: "Compare this handwriting to his other recent writings", next_scene: "scene_10" },
    ],
  },
  {
    scene_id: "scene_6",
    narration:
      "The slightly open window in Professor Hartwell's study presents a puzzling element in what should be a straightforward locked-room scenario. Upon closer inspection, you discover that the window's latch mechanism has been tampered with - someone has carefully filed down the metal catch so that it appears closed from the inside but can actually be opened from the outside with minimal force. The window overlooks a narrow courtyard that's accessible from the building's service entrance, and there are faint scuff marks on the exterior brick wall suggesting someone may have climbed up to reach it. However, the window is on the second floor, making such an approach dangerous and requiring considerable athletic ability. More puzzling still, the rain has washed away most potential evidence from the courtyard below, but you notice a small piece of fabric caught on the window frame - dark wool that doesn't match anything Professor Hartwell was wearing. This discovery transforms the locked-room mystery into something far more complex, suggesting that someone could have entered or exited through the window, but the physical evidence raises as many questions as it answers.",
    dialogues: [
      {
        speaker: "Detective Inspector Morrison",
        text: "This window latch has been deliberately modified. Someone wanted it to look secure while actually being accessible from outside.",
      },
      {
        speaker: "Forensics Officer",
        text: "The modification is recent - within the last few days based on the metal filings. And this fabric caught on the frame doesn't match the victim's clothing.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "Could someone have climbed up from the courtyard? It's quite a height.",
      },
      {
        speaker: "Forensics Officer",
        text: "Possible, but risky. The scuff marks suggest someone tried, but whether they succeeded is unclear. The rain has compromised most of the evidence below.",
      },
    ],
    background_audio: "Wind through the open window, distant traffic",
    clues: ["tampered_latch", "fabric_evidence", "scuff_marks", "courtyard_access"],
    options: [
      { text: "Test if the window route is physically possible", next_scene: "scene_7" },
      { text: "Analyze the fabric for DNA or other evidence", next_scene: "scene_8" },
      { text: "Check who had knowledge of this window's location", next_scene: "scene_9" },
    ],
  },
  {
    scene_id: "scene_7",
    narration:
      "The forensic analysis of the cyanide traces reveals a disturbing inconsistency that challenges the initial assumption of poisoning as the cause of death. The concentration found in the tea is indeed too low to be immediately fatal to a healthy adult, but Professor Hartwell's medical records reveal he had been taking medication for a heart condition - a detail that significantly changes the toxicological picture. The combination of even a small amount of cyanide with his cardiac medication could have triggered a fatal arrhythmia, making what appeared to be a failed poisoning attempt actually quite lethal. However, this raises new questions about the perpetrator's knowledge of the professor's medical condition, as such specific information would only be known to close friends, family, or medical professionals. The forensic pathologist also notes unusual bruising on the professor's wrists that wasn't immediately apparent, suggesting he may have been restrained at some point before his death. These findings paint a picture of someone who knew Professor Hartwell intimately enough to exploit his medical vulnerability, but the physical evidence suggests the encounter may not have been entirely voluntary.",
    dialogues: [
      {
        speaker: "Forensic Pathologist",
        text: "The cyanide concentration makes sense now that we know about his heart medication. The combination would be lethal even in small doses.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "So someone who knew about his medical condition could have used this knowledge to commit murder with a seemingly non-lethal amount of poison?",
      },
      {
        speaker: "Forensic Pathologist",
        text: "Exactly. But there's more - these bruise patterns on his wrists suggest restraint. Someone held him down, possibly while forcing him to drink the tea.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "That contradicts the suicide theory entirely. This is looking more like murder disguised as suicide.",
      },
    ],
    background_audio: "Medical equipment beeping, papers shuffling",
    clues: ["heart_medication", "lethal_combination", "wrist_bruising", "forced_consumption"],
    options: [
      { text: "Investigate who knew about his heart condition", next_scene: "scene_10" },
      { text: "Re-examine the study for signs of struggle", next_scene: "scene_8" },
      { text: "Check his medical records for recent appointments", next_scene: "scene_9" },
    ],
  },
  {
    scene_id: "scene_8",
    narration:
      "Thomas Chen's account of the mysterious phone calls leads to a breakthrough when you examine Professor Hartwell's phone records and discover a pattern of calls from an unlisted number over the past three weeks. The calls always came late at night and lasted exactly three minutes, suggesting they were planned communications rather than casual conversations. When you trace the number through telecommunications records, it leads to a prepaid phone purchased with cash at a convenience store near the university - a clear attempt to maintain anonymity. The store's security footage from the purchase date shows a figure in dark clothing and a baseball cap, but the image is too grainy to make a positive identification. However, the timing of these calls correlates with Thomas's observations about the professor's changed behavior, and phone records show the final call occurred just two hours before Professor Hartwell's estimated time of death. The content of these conversations remains a mystery, but their secretive nature and the timing suggest they were central to whatever led to the professor's demise. The question remains whether these calls were threats, blackmail, or something else entirely that drove the professor to his final actions.",
    dialogues: [
      {
        speaker: "Detective Inspector Morrison",
        text: "These phone records show a clear pattern. Someone was contacting Professor Hartwell regularly, always at night, always for exactly three minutes.",
      },
      {
        speaker: "Telecommunications Analyst",
        text: "The number traces to a prepaid phone bought with cash. Whoever was calling him wanted to stay anonymous.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "The final call was just two hours before his death. That can't be a coincidence.",
      },
      {
        speaker: "Thomas Chen",
        text: "I remember that night - he took a call around 6 PM and afterward he seemed... resigned. Like he'd made a difficult decision.",
      },
    ],
    background_audio: "Phone ringing, keyboard typing",
    clues: ["anonymous_calls", "prepaid_phone", "three_minute_pattern", "final_call_timing"],
    options: [
      { text: "Investigate who might have been blackmailing the professor", next_scene: "scene_9" },
      { text: "Check if any of the five override suspects bought the prepaid phone", next_scene: "scene_10" },
      { text: "Analyze the professor's behavior after each phone call", next_scene: "scene_5" },
    ],
  },
  {
    scene_id: "scene_9",
    narration:
      "The investigation into Professor Hartwell's recent research activities reveals a shocking discovery that recontextualizes everything about his death. Hidden in his private files, encrypted on his personal computer, you find evidence that he had been conducting unauthorized psychological experiments on students using subliminal messaging and behavioral manipulation techniques. The research, which he called 'Project Free Will,' was designed to test whether human decision-making could be influenced without the subject's awareness. His notes reveal growing guilt about the ethical implications of his work and fear that the university administration was about to discover his activities. More disturbing still, his research showed that several students had suffered psychological harm from his experiments, including one who had attempted suicide after being subjected to his manipulation techniques. The professor's journal entries from the weeks before his death show a man tormented by the consequences of his actions and terrified of the legal and professional ramifications if his work became public. This discovery suggests that his death might have been suicide after all - not from depression, but from overwhelming guilt and fear of exposure.",
    dialogues: [
      {
        speaker: "Computer Forensics Specialist",
        text: "Inspector, you need to see this. Professor Hartwell was conducting unauthorized psychological experiments on students. The files are heavily encrypted, but we've broken through.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "Psychological experiments? What kind of experiments?",
      },
      {
        speaker: "Computer Forensics Specialist",
        text: "Behavioral manipulation, subliminal messaging - all designed to influence decision-making without consent. He called it 'Project Free Will.'",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "And students were harmed by this? That would certainly provide motive for suicide... or murder.",
      },
    ],
    background_audio: "Computer fans whirring, keyboard clicking",
    clues: ["unauthorized_experiments", "project_free_will", "student_harm", "guilt_journal"],
    options: [
      { text: "Interview the students who were subjects in his experiments", next_scene: "scene_10" },
      { text: "Investigate if someone was threatening to expose his research", next_scene: "scene_8" },
      { text: "Check if the university administration knew about his activities", next_scene: "scene_4" },
    ],
  },
  {
    scene_id: "scene_10",
    narration:
      "The final pieces of the puzzle come together as you interview Dr. Margaret Ashford, the dean who had override access to the building. Her composed facade crumbles when confronted with the evidence of Professor Hartwell's unauthorized experiments, and she reveals that she had discovered his activities three days before his death. She admits to using her override code to enter the building that evening, intending to confront him and demand his resignation before the scandal could damage the university's reputation. However, her account of what happened in his study tells a different story than murder - she describes finding him already preparing to take his own life, having mixed the cyanide into his tea after their confrontation. Dr. Ashford claims she tried to stop him, which explains the bruising on his wrists, but he was determined to end his life rather than face the consequences of his actions. She helped him write what appeared to be a confession letter, though he died before completing it, and she staged the scene to look like he had been working normally when he died. Her motive was not murder but damage control - protecting the university from scandal by making his suicide appear accidental. The truth reveals a complex web of guilt, fear, and institutional protection that led to a man's death and a cover-up that nearly succeeded.",
    dialogues: [
      {
        speaker: "Dr. Margaret Ashford",
        text: "I... I found out about his experiments three days ago. A student came forward, traumatized by what he had done to her mind.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "So you confronted him that evening. You used your override code to get into the building.",
      },
      {
        speaker: "Dr. Margaret Ashford",
        text: "Yes, but when I got to his study, he had already... he had already prepared the poison. He said he couldn't live with what he had done.",
      },
      {
        speaker: "Detective Inspector Morrison",
        text: "But you tried to stop him. That's how he got the bruises on his wrists.",
      },
      {
        speaker: "Dr. Margaret Ashford",
        text: "I grabbed his hands, tried to take the cup away, but he was so determined. He said it was the only way to make amends. Then he asked me to help him write a letter, to explain... but he died before he could finish it.",
      },
    ],
    background_audio: "Quiet sobbing, clock ticking",
    clues: ["dean_confession", "assisted_suicide", "cover_up_motive", "institutional_protection"],
    options: [
      { text: "Arrest Dr. Ashford for obstruction of justice and assisted suicide", next_scene: "ending_1" },
      { text: "Consider the ethical complexities and recommend counseling over prosecution", next_scene: "ending_2" },
      {
        text: "Focus on exposing the university's systemic failures that enabled this tragedy",
        next_scene: "ending_3",
      },
    ],
  },
]

const endings = {
  ending_1: {
    title: "Justice Served",
    content:
      "Dr. Margaret Ashford is arrested and charged with assisted suicide and obstruction of justice. The case exposes the dark underbelly of academic research and leads to sweeping reforms in university oversight. Professor Hartwell's victims receive counseling and compensation, while his research is destroyed to prevent further harm. The truth, though painful, ensures that justice is served and similar tragedies are prevented.",
  },
  ending_2: {
    title: "Compassionate Resolution",
    content:
      "Recognizing the complex ethical dimensions of the case, you recommend that Dr. Ashford receive counseling and community service rather than prosecution. The focus shifts to helping Professor Hartwell's victims heal and implementing safeguards to prevent future unauthorized research. The case becomes a catalyst for important conversations about research ethics and institutional responsibility.",
  },
  ending_3: {
    title: "Systemic Reform",
    content:
      "The investigation reveals systemic failures in university oversight that enabled Professor Hartwell's unethical research to continue unchecked. Your report leads to a comprehensive review of research protocols and the establishment of independent ethics boards. While Dr. Ashford faces administrative consequences, the focus remains on preventing future tragedies through institutional reform and transparency.",
  },
}

export default function ProfessorStudyCase() {
  const router = useRouter()
  const [currentScene, setCurrentScene] = useState<string>("scene_1")
  const [discoveredClues, setDiscoveredClues] = useState<string[]>([])
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1"])
  const [gameEnded, setGameEnded] = useState<boolean>(false)
  const [ending, setEnding] = useState<string>("")

  useEffect(() => {
    const scene = mockStoryData.find((s) => s.scene_id === currentScene)
    if (scene) {
      setDiscoveredClues((prev) => [...new Set([...prev, ...scene.clues])])
    }
  }, [currentScene])

  const handleOptionClick = (nextScene: string) => {
    if (nextScene.startsWith("ending_")) {
      setGameEnded(true)
      setEnding(nextScene)
    } else {
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

  const currentSceneData = mockStoryData.find((scene) => scene.scene_id === currentScene)

  if (gameEnded && ending) {
    const endingData = endings[ending as keyof typeof endings]
    return (
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #7c2d92 0%, #a855f7 50%, #6b21a8 100%)",
          color: "#fef3c7",
          padding: "20px",
        }}
      >
        <div className="scene-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="narration-box">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl font-serif text-amber-200">Case Closed</h1>
            </div>

            <h2 className="text-2xl font-serif text-amber-300 mb-4">{endingData.title}</h2>
            <p className="text-lg leading-relaxed text-amber-100 mb-8">{endingData.content}</p>

            <div className="flex justify-between items-center">
              <button onClick={() => router.push("/")} className="option-button">
                <ArrowLeft className="w-5 h-5" />
                Return to Cases
              </button>

              <div className="text-amber-300">
                <span className="text-sm">Clues Discovered: {discoveredClues.length}</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .scene-content {
            max-width: 900px;
            margin: 0 auto;
          }
        `}</style>
      </div>
    )
  }

  if (!currentSceneData) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #7c2d92 0%, #a855f7 50%, #6b21a8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fef3c7",
          padding: "20px",
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)),
          url('/professor.png'),
          linear-gradient(135deg, #7c2d92 0%, #a855f7 50%, #6b21a8 100%)
        `,
        backgroundSize: "cover, cover, cover",
        backgroundPosition: "center, center, center",
        backgroundBlendMode: "overlay, normal, normal",
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

      <div className="scene-content" style={{ maxWidth: "900px", margin: "0 auto", paddingRight: "320px" }}>
        {/* Header */}
        <div className="section-header">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl font-serif text-amber-200">The Professor's Final Lesson</h1>
            </div>

            <div className="scene-counter">
              <Search className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-200">Scene {currentScene.split("_")[1]}/10</span>
            </div>
          </div>
        </div>

        {/* Main Story Panel */}
        <div className="narration-box">
          <h2 className="text-xl font-serif text-amber-300 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Investigation Notes
          </h2>
          <p className="text-amber-100 leading-relaxed text-lg font-serif">{currentSceneData.narration}</p>
        </div>

        {/* Dialogue Section */}
        {currentSceneData.dialogues.length > 0 && (
          <div className="dialogue-section">
            <h3 className="text-lg font-serif text-amber-300 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Conversations
            </h3>
            <div className="space-y-3">
              {currentSceneData.dialogues.map((dialogue, index) => (
                <div key={index} className="dialogue-item">
                  <div className="font-semibold text-amber-300 mb-2">{dialogue.speaker}:</div>
                  <div className="text-amber-100 italic">"{dialogue.text}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options Section */}
        <div className="options-section">
          <h3 className="text-lg font-serif text-amber-300 mb-4">Your Next Move:</h3>
          <div className="options-grid">
            {currentSceneData.options.map((option, index) => (
              <button key={index} onClick={() => handleOptionClick(option.next_scene)} className="option-button">
                {option.text}
              </button>
            ))}
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
          {discoveredClues.map((clue, index) => (
            <div key={index} className="clue-item">
              <div className="clue-name">{clue.replace(/_/g, " ")}</div>
            </div>
          ))}
          {discoveredClues.length === 0 && (
            <div className="text-amber-400 text-sm italic">No evidence collected yet...</div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-amber-600/30">
          <div className="text-xs text-amber-400">Background: {currentSceneData.background_audio}</div>
        </div>
      </div>

      {/* Return to Cases Button */}
      <div className="fixed bottom-6 left-6">
        <button onClick={() => router.back()} className="return-button">
          <ArrowLeft className="w-4 h-4" />
          Return to Cases
        </button>

        {/* Fixed Back Button */}
      {/* <button className="back-button" onClick={() => router.back()}>
        <span>← RETURN TO CASES</span>
      </button> */}
      </div>

      <style jsx>{`
        .scene-content {
          max-width: 900px;
          margin: 0 auto;
          padding-right: 320px;
        }

        .section-header h3 {
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .narration-box {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.7) 0%, rgba(251, 191, 36, 0.7) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .dialogue-section {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.7) 0%, rgba(251, 191, 36, 0.7) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .dialogue-item {
          background: linear-gradient(135deg, rgba(180, 83, 9, 0.3) 0%, rgba(21, 128, 61, 0.3) 100%);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 8px;
          padding: 16px;
        }

        .options-section {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.7) 0%, rgba(251, 191, 36, 0.7) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(251, 191, 36, 0.3);
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
          background: linear-gradient(135deg, rgba(180, 83, 9, 0.8) 0%, rgba(21, 128, 61, 0.8) 100%);
          border: 1px solid rgba(251, 191, 36, 0.4);
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

        .option-button:hover {
          background: linear-gradient(135deg, rgba(194, 65, 12, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%);
          border-color: rgba(251, 191, 36, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
        }

        .evidence-sidebar {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 280px;
          height: calc(100vh - 40px);
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(34, 197, 94, 0.95) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 24px;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 1000;
        }

        .sidebar-header h3 {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .clues-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .clue-item {
          background: linear-gradient(135deg, rgba(21, 128, 61, 0.4) 0%, rgba(180, 83, 9, 0.4) 100%);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 8px;
          padding: 12px;
        }

        .clue-name {
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .previous-scene-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, rgba(21, 128, 61, 0.8) 0%, rgba(180, 83, 9, 0.8) 100%);
          border: 1px solid rgba(251, 191, 36, 0.4);
          border-radius: 8px;
          color: #fef3c7;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .previous-scene-button:hover {
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.9) 0%, rgba(194, 65, 12, 0.9) 100%);
          border-color: rgba(251, 191, 36, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
        }

        .scene-counter {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, rgba(180, 83, 9, 0.5) 0%, rgba(21, 128, 61, 0.5) 100%);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 8px;
        }

        .return-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(180, 83, 9, 0.8) 0%, rgba(21, 128, 61, 0.8) 100%);
          border: 1px solid rgba(251, 191, 36, 0.4);
          border-radius: 8px;
          color: #fef3c7;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .return-button:hover {
          background: linear-gradient(135deg, rgba(194, 65, 12, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%);
          border-color: rgba(251, 191, 36, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
