"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Mock data for the noir New York detective story
const mockCaseData = {
  title: "Shadows in the Spotlight: The Vanishing of Velvet Rose",
  scenes: [
    {
      scene_id: "scene_1",
      narration:
        "The rain hammers against the grimy windows of your office on the third floor of a crumbling building in Hell's Kitchen. It's 2 AM on a Tuesday in 1947, and the city never sleeps, especially not in your line of work. The neon signs from the jazz clubs below cast an eerie red glow through the venetian blinds, painting shadows that dance across your desk like ghosts of the past. Your secretary left hours ago, leaving behind only the lingering scent of cheap perfume and the echo of her heels on the wooden floor. The phone rings, cutting through the silence like a knife through silk. On the other end, a voice trembles with desperation - it's Mickey Torrino, owner of the Blue Moon nightclub, and he's got a problem that money can't fix. His star performer, the sultry jazz singer known as Velvet Rose, has vanished without a trace after her show last night. The police won't take it seriously - just another dame who probably ran off with a lover, they say. But Mickey knows better, and so do you.",
      dialogues: [
        {
          character: "Mickey Torrino",
          speech:
            "Detective, you gotta help me. Velvet Rose... she's gone. Disappeared right after her last set. The cops think she just skipped town, but I know something ain't right.",
        },
        { character: "You", speech: "When did you last see her, Mickey? And who else was around that night?" },
        {
          character: "Mickey Torrino",
          speech:
            "She finished her set around midnight, went to her dressing room to change. By 1 AM, she was gone. Her things were still there, but she wasn't. There were some regulars in the crowd - Tommy 'The Fish' Marconi, that music producer Vincent Kane, and her pianist, Eddie Fontaine.",
        },
      ],
      background_audio: "rain",
      options: [
        {
          option_id: "head_to_club",
          description: "Head to the Blue Moon nightclub immediately",
          next_scene: "scene_2",
          required_clues: [],
        },
        {
          option_id: "visit_apartment",
          description: "Visit Velvet Rose's apartment first",
          next_scene: "scene_3",
          required_clues: [],
        },
        {
          option_id: "check_police",
          description: "Check with your police contacts for more information",
          next_scene: "scene_4",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_2",
      narration:
        "The Blue Moon nightclub sits like a jewel in the rough on 52nd Street, its blue neon sign flickering against the wet pavement. Even at this ungodly hour, the place still thrums with the ghost of music and the lingering smoke of a hundred cigarettes. Mickey leads you through the empty club, past overturned chairs and abandoned drinks, the stage still bathed in a single spotlight that seems to wait for a performer who will never return. The air is thick with the scent of gin, tobacco, and something else - fear. Behind the bar, glasses catch the light like diamonds, and the mirror reflects your weathered face back at you, a man who's seen too much of the city's dark side. Mickey's hands shake as he pours himself a whiskey, the amber liquid catching the light like liquid gold. The dressing room door stands ajar, and through it, you can see the remnants of a life interrupted - a silk dress draped over a chair, makeup scattered across a vanity, and a photograph of a young woman with sad eyes. This is where the trail begins, in this temple of jazz and broken dreams.",
      dialogues: [
        {
          character: "Mickey Torrino",
          speech:
            "This is her dressing room. Everything's just like she left it. Look at that - her lucky necklace is still here. She never went anywhere without it.",
        },
        { character: "You", speech: "Tell me about the people who were here that night. Start with Tommy Marconi." },
        {
          character: "Mickey Torrino",
          speech:
            "Tommy's been coming here for months, always sits at the same table, always orders the same drink. He's got a thing for Velvet, but she never gave him the time of day. Vincent Kane, the producer, he's been trying to sign her to a record deal. And Eddie... well, Eddie's been her pianist for two years. They're close, real close.",
        },
      ],
      background_audio: "mystery",
      clues: [
        {
          clue_id: "lucky_necklace",
          name: "Lucky Necklace",
          description: "Velvet's lucky necklace left behind in dressing room",
        },
        {
          clue_id: "dressing_room_undisturbed",
          name: "Undisturbed Dressing Room",
          description: "Her belongings were left untouched",
        },
      ],
      options: [
        {
          option_id: "examine_dressing_room",
          description: "Examine Velvet Rose's dressing room thoroughly",
          next_scene: "scene_5",
          required_clues: [],
        },
        {
          option_id: "interview_bartender",
          description: "Interview the bartender who worked that night",
          next_scene: "scene_6",
          required_clues: [],
        },
        {
          option_id: "check_back_exit",
          description: "Check the club's back exit and alley",
          next_scene: "scene_7",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_3",
      narration:
        "Velvet Rose's apartment building stands like a monument to faded elegance on the Upper West Side, its art deco facade crumbling under the weight of time and neglect. The doorman, a grizzled old-timer named Frank, recognizes you from your days on the force and lets you up without question. The elevator creaks and groans as it carries you to the seventh floor, each floor marked by the ghost of better times. Her apartment door is unlocked - a detail that sends ice through your veins. Inside, the place is a study in contrasts: expensive furniture mixed with cheap trinkets, silk curtains hanging beside newspaper clippings, and everywhere, the scent of her perfume lingering like a memory that refuses to fade. The living room is immaculate, too immaculate, as if someone has been here before you, cleaning up, removing evidence. On the mantelpiece sits a collection of photographs - Velvet with various men, all smiling, all looking like they had secrets to hide. The bedroom tells a different story: drawers pulled open, clothes scattered, and on the nightstand, a half-finished letter that begins 'My Dearest...' but the rest is torn away. Someone was looking for something, and they might have found it.",
      dialogues: [
        {
          character: "Frank the Doorman",
          speech:
            "Miss Rose? Yeah, she came home around 12:30 last night. Seemed nervous, kept looking over her shoulder. Asked me if anyone had been asking about her.",
        },
        { character: "You", speech: "Did you see her leave again? Or notice anyone else coming to visit?" },
        {
          character: "Frank the Doorman",
          speech:
            "That's the thing, Detective. I never saw her leave. But around 2 AM, I heard her door slam. When I checked this morning, it was unlocked. That ain't like her - she was always careful about locking up.",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "apartment_searched",
          name: "Apartment Searched",
          description: "Someone had been through Velvet's apartment",
        },
        { clue_id: "torn_letter", name: "Torn Letter", description: "A partially destroyed love letter" },
      ],
      options: [
        {
          option_id: "search_letter",
          description: "Search for the rest of the torn letter",
          next_scene: "scene_8",
          required_clues: [],
        },
        {
          option_id: "examine_photos",
          description: "Examine the photographs on the mantelpiece",
          next_scene: "scene_9",
          required_clues: [],
        },
        {
          option_id: "question_tenants",
          description: "Question the other tenants about what they heard",
          next_scene: "scene_5",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_4",
      narration:
        "Police headquarters at One Police Plaza buzzes with activity even in the early morning hours, a hive of corruption and occasional justice that you know all too well from your days in uniform. Detective Ray Sullivan, your old partner, greets you with a mixture of warmth and wariness - he knows you don't come calling unless there's trouble brewing. The precinct smells of stale coffee, cigarette smoke, and the particular brand of desperation that comes with trying to keep order in a city that thrives on chaos. Ray's desk is cluttered with case files, empty coffee cups, and a photograph of his wife and kids - a reminder of the life he's trying to protect by staying on the right side of the law. He pulls out a thin file marked 'Rose, Vivian' - Velvet's real name - and slides it across the desk with a grimace. The file is disappointingly thin, containing only a missing person report filed by Mickey and a few notes from the responding officer. But Ray's expression tells you there's more to the story, something that didn't make it into the official record. In this city, the most important information is often what doesn't get written down.",
      dialogues: [
        {
          character: "Detective Ray Sullivan",
          speech:
            "Look, I'll level with you. The brass doesn't want us wasting time on this. Word came down from upstairs - let sleeping dogs lie. But between you and me, there's something fishy about this whole thing.",
        },
        {
          character: "You",
          speech: "What aren't you telling me, Ray? We've been through too much together for you to hold back now.",
        },
        {
          character: "Detective Ray Sullivan",
          speech:
            "Velvet Rose... she wasn't just a singer. Word is she was connected to some big shots, if you know what I mean. Politicians, businessmen, the kind of people who don't like their names in the papers. And there's been talk about her having some kind of insurance policy - recordings, photographs, things that could ruin careers.",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "police_cover_up",
          name: "Police Cover-up",
          description: "Orders from above to not investigate thoroughly",
        },
        {
          clue_id: "powerful_connections",
          name: "Powerful Connections",
          description: "Velvet was connected to politicians and businessmen",
        },
      ],
      options: [
        {
          option_id: "press_ray",
          description: "Press Ray for more details about the cover-up",
          next_scene: "scene_6",
          required_clues: [],
        },
        {
          option_id: "ask_recordings",
          description: "Ask about the recordings and photographs",
          next_scene: "scene_8",
          required_clues: [],
        },
        {
          option_id: "investigate_club",
          description: "Head to the Blue Moon to investigate further",
          next_scene: "scene_2",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_5",
      narration:
        "The dressing room at the Blue Moon is a shrine to a vanished goddess, every surface telling the story of a woman who lived her life in the spotlight but kept her secrets in the shadows. The vanity mirror is surrounded by bulbs, half of them burned out, casting uneven light across the scattered cosmetics and jewelry. You run your fingers along the edge of the mirror and feel something - a hidden compartment, cleverly concealed behind the glass. Inside, you find a small key and a piece of paper with an address scrawled in Velvet's handwriting. The silk dress draped over the chair still holds the faint scent of her perfume, and in its pocket, you discover a matchbook from a place called 'The Crimson Room' - a speakeasy that officially doesn't exist. The lucky necklace Mickey mentioned catches your eye; it's not just jewelry, but a locket containing a photograph of a young girl, maybe eight years old, with Velvet's eyes. On the back of the photograph, someone has written 'For my little songbird - Love, Papa.' The pieces of a puzzle are starting to come together, but the picture they're forming is darker than you expected. Every clue leads to more questions, and every answer reveals another layer of deception in this city of shadows.",
      dialogues: [
        { character: "You", speech: "Mickey, did Velvet ever mention having family? A daughter, maybe?" },
        {
          character: "Mickey Torrino",
          speech:
            "Family? Nah, she always said she was alone in the world. But now that you mention it, she did get a letter once a month, always made her cry. And she'd disappear for a few hours every Sunday, never said where she went.",
        },
        { character: "You", speech: "What about this place - The Crimson Room? You know anything about it?" },
        {
          character: "Mickey Torrino",
          speech:
            "That's... that's not a place you want to go asking about, Detective. It's where the real power in this city meets. Politicians, mob bosses, judges - they all got their fingers in that pie.",
        },
      ],
      background_audio: "mystery",
      clues: [
        { clue_id: "hidden_key", name: "Hidden Key", description: "A key found in a secret compartment" },
        {
          clue_id: "crimson_room_matchbook",
          name: "Crimson Room Matchbook",
          description: "Matchbook from an exclusive speakeasy",
        },
        {
          clue_id: "daughter_photo",
          name: "Daughter's Photo",
          description: "Photo of a young girl in Velvet's locket",
        },
      ],
      options: [
        {
          option_id: "follow_address",
          description: "Follow the address from the hidden compartment",
          next_scene: "scene_7",
          required_clues: [],
        },
        {
          option_id: "investigate_crimson",
          description: "Investigate The Crimson Room speakeasy",
          next_scene: "scene_9",
          required_clues: [],
        },
        {
          option_id: "track_daughter",
          description: "Track down information about Velvet's daughter",
          next_scene: "scene_8",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_6",
      narration:
        "The bartender at the Blue Moon is a thin, nervous man named Sal who's seen enough in his forty years behind the bar to know when to talk and when to keep his mouth shut. His hands shake slightly as he polishes glasses that are already clean, and his eyes dart toward the door every few seconds as if expecting trouble to walk through it. The bar itself is a work of art, carved mahogany that's survived Prohibition and countless nights of jazz, gin, and broken hearts. Sal's been working here for fifteen years, and he knows every regular, every drink order, and every secret that's been whispered across his bar. When you mention Velvet Rose, his face goes pale, and he nearly drops the glass he's holding. He glances around the empty club before leaning in close, his voice barely above a whisper. The story he tells paints a picture of a woman caught between two worlds - the glamorous life of a jazz singer and the dangerous reality of knowing too much about the wrong people. According to Sal, the night Velvet disappeared, she received a phone call that changed everything. After hanging up, she was different - scared, desperate, and talking about leaving town for good.",
      dialogues: [
        {
          character: "Sal the Bartender",
          speech:
            "That night... Miss Rose got a call around 11:30, right before her last set. I could see her face change, you know? Like someone had just told her the world was ending.",
        },
        { character: "You", speech: "Did you hear any of the conversation? See who might have been calling?" },
        {
          character: "Sal the Bartender",
          speech:
            "I heard her say something about 'the recordings' and 'they can't have them.' Then she said something that chilled me to the bone - 'If something happens to me, look for the songbird.' After that call, she went on stage, but her heart wasn't in it. She kept looking at the exits.",
        },
        { character: "You", speech: "Tell me about the regulars who were here that night. Anyone acting strange?" },
        {
          character: "Sal the Bartender",
          speech:
            "Tommy Marconi was drunker than usual, kept muttering about how Velvet was 'too good for this place.' Vincent Kane left right after her set, didn't even finish his drink. And Eddie... Eddie looked like he'd seen a ghost. He packed up his piano and left without saying goodbye to anyone.",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "threatening_phone_call",
          name: "Threatening Phone Call",
          description: "Velvet received a disturbing call before her last set",
        },
        {
          clue_id: "songbird_clue",
          name: "Songbird Reference",
          description: 'Velvet mentioned looking for "the songbird"',
        },
      ],
      options: [
        {
          option_id: "track_eddie",
          description: "Track down Eddie Fontaine, the pianist",
          next_scene: "scene_7",
          required_clues: [],
        },
        {
          option_id: "investigate_kane",
          description: "Investigate Vincent Kane, the music producer",
          next_scene: "scene_8",
          required_clues: [],
        },
        {
          option_id: "follow_marconi",
          description: "Follow up on Tommy Marconi's whereabouts",
          next_scene: "scene_9",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_7",
      narration:
        "The address from Velvet's hidden compartment leads you to a rundown warehouse in the Meatpacking District, where the smell of blood and decay mingles with the salt air from the Hudson River. The building looks abandoned from the outside, its windows boarded up and its walls covered in graffiti, but you notice fresh tire tracks in the mud and cigarette butts that haven't been rained on. Using the key you found, you unlock a side door and step into a world that exists in the shadows of the city. The warehouse has been converted into a recording studio, complete with professional equipment that must have cost a fortune. Reels of tape are stacked everywhere, each one labeled with dates and initials that mean nothing to you yet. In the center of the room sits a piano, the same model as the one at the Blue Moon, and scattered sheet music tells the story of late-night recording sessions. But it's what you find in the office that makes your blood run cold - photographs of prominent city officials in compromising positions, financial records showing payoffs and bribes, and most damning of all, recordings of conversations that could bring down half the city government. This is Velvet's insurance policy, her protection against the powerful men who used her club as their private meeting place. But insurance policies can become death warrants when the wrong people find out about them.",
      dialogues: [
        { character: "You", speech: "So this is where she kept her secrets. But who else knew about this place?" },
        {
          character: "Eddie Fontaine",
          speech:
            "Detective! Thank God you found this place. I've been hiding here since last night. They killed her, didn't they? They killed Velvet because she was going to expose them all.",
        },
        { character: "You", speech: "Eddie? What are you doing here? And who is 'they'?" },
        {
          character: "Eddie Fontaine",
          speech:
            "The men in the photographs, the ones on the recordings. Velvet was going to take everything to the newspapers. She said she was tired of being their puppet, tired of watching them destroy the city while she kept their secrets. But someone found out about her plan.",
        },
      ],
      background_audio: "tension",
      clues: [
        {
          clue_id: "secret_recording_studio",
          name: "Secret Recording Studio",
          description: "Hidden warehouse converted to recording facility",
        },
        {
          clue_id: "compromising_evidence",
          name: "Compromising Evidence",
          description: "Photos and recordings of corrupt officials",
        },
      ],
      options: [
        {
          option_id: "listen_recordings",
          description: "Listen to the recordings to identify the voices",
          next_scene: "scene_8",
          required_clues: [],
        },
        {
          option_id: "examine_photos",
          description: "Examine the photographs for clues",
          next_scene: "scene_9",
          required_clues: [],
        },
        {
          option_id: "question_eddie",
          description: "Question Eddie about who else knew about this place",
          next_scene: "scene_8",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_8",
      narration:
        "The photographs spread across the desk tell a story of corruption that runs deeper than you ever imagined, each image a window into the soul of a city for sale. Mayor Flanagan shaking hands with known mobsters, Judge Morrison accepting envelopes full of cash, Police Commissioner Brady sharing drinks with the very criminals his department is supposed to arrest. But it's the recordings that truly damn them all - hours of conversations where they discuss bribes, fixed trials, and the systematic looting of the city's coffers. Velvet's voice appears on several tapes, sometimes as a participant in the conversations, sometimes as a silent witness whose presence was forgotten by men drunk on power and whiskey. As you listen, a pattern emerges: Velvet was more than just entertainment for these gatherings, she was their confessor, the beautiful woman they trusted with their darkest secrets because they never imagined she was smart enough to use them. The final recording is dated just three days ago, and on it, you hear Velvet's voice, clear and determined, telling someone that she's 'done being their canary in a cage' and that 'the songbird is ready to sing a different tune.' The response is chilling - a man's voice, cultured and cold, saying 'Then perhaps it's time to clip the songbird's wings permanently.' You recognize the voice, and the realization hits you like a punch to the gut.",
      dialogues: [
        {
          character: "Vincent Kane",
          speech:
            "I see you've found our little insurance policy, Detective. Velvet was always too clever for her own good.",
        },
        {
          character: "You",
          speech:
            "Vincent Kane. I should have known. You killed her because she was going to expose your whole operation.",
        },
        {
          character: "Vincent Kane",
          speech:
            "Killed her? Oh, Detective, you misunderstand. Velvet Rose is very much alive. She's simply... relocated. You see, she agreed to disappear in exchange for her daughter's safety. A mother's love is such a powerful motivator.",
        },
        { character: "You", speech: "Where is she, Kane? And where's the child?" },
        {
          character: "Vincent Kane",
          speech:
            "Somewhere safe, where they can start a new life far from the corruption of this city. But first, we need to ensure that these recordings never see the light of day. I'm afraid that means you've become a liability, Detective.",
        },
      ],
      background_audio: "tension",
      clues: [
        { clue_id: "kane_confession", name: "Kane's Confession", description: "Vincent Kane admits his involvement" },
        { clue_id: "velvet_alive", name: "Velvet Alive", description: "Velvet Rose is alive but in hiding" },
      ],
      options: [
        {
          option_id: "arrest_kane",
          description: "Try to arrest Vincent Kane",
          next_scene: "scene_10",
          required_clues: [],
        },
        {
          option_id: "demand_info",
          description: "Demand to know where Velvet and her daughter are",
          next_scene: "scene_10",
          required_clues: [],
        },
        {
          option_id: "escape_evidence",
          description: "Attempt to escape with the evidence",
          next_scene: "scene_10",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_9",
      narration:
        "The Crimson Room exists in the basement of an upscale hotel on Park Avenue, hidden behind a door marked 'Private' and accessible only to those who know the right password and have the right connections. The descent into this underground world feels like a journey into the heart of the city's corruption, each step taking you deeper into a realm where money talks and morality is just another commodity to be bought and sold. The room itself is a study in decadent luxury - red velvet walls, crystal chandeliers, and tables where the city's most powerful men gather to divide up the spoils of their various schemes. Tonight, the room is nearly empty, save for a few die-hard gamblers and a woman sitting alone at the bar, her back to you. When she turns around, your heart stops - it's Velvet Rose, alive but changed, her eyes holding a weariness that wasn't there before. She's not surprised to see you; in fact, she seems to have been waiting. The story she tells over whiskey and cigarettes is one of survival, sacrifice, and a mother's desperate love. She didn't disappear - she made a deal with the devil to protect the one thing that mattered more to her than her own life. But deals with devils always come with a price, and now that price is coming due.",
      dialogues: [
        {
          character: "Velvet Rose",
          speech:
            "Hello, Detective. I wondered when you'd find me. Mickey hired you, didn't he? Poor Mickey, he never understood that some cages are gilded for a reason.",
        },
        { character: "You", speech: "Velvet! Everyone thinks you're dead. What happened? Why did you disappear?" },
        {
          character: "Velvet Rose",
          speech:
            "Because they have my daughter, Detective. My little songbird, the one thing in this world that matters more to me than my own life. They took her to ensure my silence, and they'll kill her if I don't play by their rules.",
        },
        { character: "You", speech: "Who has her? Vincent Kane? The men in the photographs?" },
        {
          character: "Velvet Rose",
          speech:
            "All of them. They're all part of it - a web of corruption that reaches into every corner of this city. I thought I could outsmart them, use their own secrets against them. But they were always one step ahead. The only way to save my daughter was to disappear, to become their ghost singer, performing only for them, keeping their secrets forever.",
        },
      ],
      background_audio: "mystery",
      clues: [
        {
          clue_id: "velvet_alive_confirmed",
          name: "Velvet Alive (Confirmed)",
          description: "Direct confirmation that Velvet Rose is alive",
        },
        {
          clue_id: "daughter_kidnapped",
          name: "Daughter Kidnapped",
          description: "Velvet's daughter was taken to ensure compliance",
        },
      ],
      options: [
        {
          option_id: "offer_help",
          description: "Offer to help rescue her daughter",
          next_scene: "scene_10",
          required_clues: [],
        },
        {
          option_id: "convince_testify",
          description: "Try to convince her to testify against them",
          next_scene: "scene_10",
          required_clues: [],
        },
        {
          option_id: "bring_down_ring",
          description: "Ask her to help you bring down the corruption ring",
          next_scene: "scene_10",
          required_clues: [],
        },
      ],
    },
    {
      scene_id: "scene_10",
      narration:
        "The final confrontation takes place back at the warehouse, where all the threads of this dark tapestry finally come together in a pattern of betrayal, corruption, and ultimately, redemption. Vincent Kane and his associates have arrived, expecting to find you dead and the evidence destroyed, but instead they walk into a trap. With Velvet's help, you've managed to contact the one honest reporter in the city, and the recordings are already on their way to the printing presses. The corrupt officials who thought they owned the city are about to discover that their empire of shadows cannot survive in the light of truth. Kane's face twists with rage as he realizes his carefully constructed world is crumbling around him, but his anger turns to fear when he sees the federal agents emerging from the shadows - this case has attracted attention from Washington, and the corruption runs too deep for local solutions. Velvet stands beside you, no longer the frightened woman hiding in the shadows, but a mother fighting for her child's future and a citizen reclaiming her city from the criminals who stole it. The rescue of her daughter from a safe house in Queens happens simultaneously with the arrests, a coordinated operation that brings justice to a city that had almost forgotten what it looked like. As the sun rises over New York, painting the sky in shades of gold and crimson, you realize that sometimes the best cases are the ones where everyone gets a second chance at redemption.",
      dialogues: [
        {
          character: "Vincent Kane",
          speech:
            "You think you've won, Detective? You have no idea how deep this goes. We own judges, politicians, even federal agents. This city belongs to us!",
        },
        {
          character: "Federal Agent Morrison",
          speech:
            "Not anymore, Kane. We've been building a case against your organization for months. These recordings are just the final piece of evidence we needed.",
        },
        { character: "Velvet Rose", speech: "My daughter... is she safe? Please tell me she's safe." },
        {
          character: "You",
          speech:
            "She's safe, Velvet. She's waiting for you at the precinct with a social worker. This nightmare is over.",
        },
        {
          character: "Velvet Rose",
          speech:
            "Thank you, Detective. For the first time in years, I can sing again - really sing, not just perform for monsters. The songbird is finally free.",
        },
      ],
      background_audio: "resolution",
      options: [
        {
          option_id: "case_solved",
          description: "Case Solved - Justice Prevails",
          next_scene: "ending",
          required_clues: [],
        },
      ],
    },
  ],
}

export default function NoirNewYorkPage() {
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
        // Simulate network latency to preserve the loading screen experience
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const res = await fetch("/api/noir-new-york", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch case data")
        const data = await res.json()
        setCaseData(data)
      } catch (err) {
        // Fallback to local mock if API fails; preserves exact UI
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
    const scene = getCurrentSceneData()
    if (scene?.clues) {
      const newClues = scene.clues.map((clue) => clue.clue_id)
      setDiscoveredClues((prev) => [...new Set([...prev, ...newClues])])
    }

    if (option.next_scene === "ending") {
      alert(
        "Case Solved! Vincent Kane and his corrupt network have been exposed. Velvet Rose and her daughter are safely reunited, and justice has prevailed in the city of shadows.",
      )
      return
    }

    setSceneHistory((prev) => [...prev, option.next_scene])
    setCurrentScene(option.next_scene)
  }

  const handleBackToScene = () => {
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
        <p>Entering the shadows of New York...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #000000, #1f2937);
            color: #d97706;
            font-family: "Crimson Text", serif;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(217, 119, 6, 0.3);
            border-top: 3px solid #d97706;
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
        <div className="noir-overlay"></div>

        <div className="case-header">
          <h1>{caseData.title}</h1>
          <div className="clues-counter">Evidence Collected: {discoveredClues.length}</div>
        </div>

        <div className="scene-content">
          {sceneHistory.length > 1 && (
            <button className="scene-back-button" onClick={handleBackToScene}>
              ← Previous Scene
            </button>
          )}

          <div className="narration-box">
            <h3>🕵️ Investigation</h3>
            <p className="narration">{scene.narration}</p>
          </div>

          {scene.dialogues && scene.dialogues.length > 0 && (
            <div className="dialogue-section">
              <h3>💬 Conversations</h3>
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
              {scene.options.map((option, index) => (
                <button key={index} className="option-btn" onClick={() => handleOptionClick(option)}>
                  {option.description}
                </button>
              ))}
            </div>
          </div>
        </div>

        {discoveredClues.length > 0 && (
          <div className="evidence-sidebar">
            <h3>📋 Evidence File</h3>
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
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
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
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(0,191,255,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(138,43,226,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(0,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
          animation: noirDrift 25s ease-in-out infinite;
        }

        @keyframes noirDrift {
          0%, 100% { opacity: 0.4; transform: translateX(0px); }
          50% { opacity: 0.7; transform: translateX(15px); }
        }

        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(0, 191, 255, 0.15);
          border-radius: 15px;
          border: 2px solid #00bfff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }

        .case-header h1 {
          font-size: 2.8rem;
          margin: 0 0 10px 0;
          color: #00bfff;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
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
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
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
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
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
          background: rgba(0, 191, 255, 0.8);
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
          transform: translateX(-3px);
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
  )
}
