"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface DialogueEntry {
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
  next_scene: string
  required_clues?: string[]
}

interface Scene {
  scene_id: string
  narration: string
  dialogues: DialogueEntry[]
  background_audio: string
  clues: Clue[]
  options: Option[]
}

const mockData: Scene[] = [
  {
    scene_id: "scene_1",
    narration:
      "The morning sun filters through the glass pyramid of the Louvre, casting geometric shadows across the marble floors of the world's most prestigious museum. Detective Amélie Dubois stands before the empty frame where Leonardo da Vinci's 'La Belle Ferronnière' once hung, her trained eyes scanning every detail of the crime scene. The security tape shows nothing unusual from the previous evening, yet somehow, one of the most valuable paintings in human history has vanished without a trace. The museum's director, Monsieur Beaumont, paces nervously behind her, his hands trembling as he explains the impossible situation. The painting was there during the final security check at 11 PM, but when the morning shift arrived, they found only an empty frame and a small white card left in its place. The card bears a single line in elegant script: 'Art belongs to those who truly understand its beauty.' The theft has sent shockwaves through the international art world, and the pressure to solve this case quickly is immense.",
    dialogues: [
      {
        character: "Director Beaumont",
        speech:
          "Detective Dubois, this is catastrophic! The 'La Belle Ferronnière' is worth over 100 million euros. How could someone simply walk out with it?",
      },
      {
        character: "Detective Dubois",
        speech:
          "Monsieur Beaumont, I need you to remain calm. Tell me, who had access to this wing after closing hours?",
      },
      {
        character: "Director Beaumont",
        speech:
          "Only our senior staff: the night security guards, the chief curator Dr. Moreau, and myself. But surely none of them would...",
      },
      {
        character: "Detective Dubois",
        speech:
          "In my experience, the impossible often becomes possible when we examine it closely. I'll need a complete list of everyone with access.",
      },
    ],
    background_audio: "mystery",
    clues: [
      {
        clue_id: "empty_frame",
        name: "Empty Frame",
        description:
          "The ornate golden frame that once held La Belle Ferronnière, now containing only mounting hardware and a faint outline where the painting once hung.",
      },
      {
        clue_id: "mysterious_card",
        name: "Mysterious Card",
        description:
          "A small white card left at the crime scene with elegant script reading: 'Art belongs to those who truly understand its beauty.'",
      },
      {
        clue_id: "access_list",
        name: "Access List",
        description:
          "A complete roster of all personnel with after-hours access to the Renaissance wing, including security guards, curators, and administrative staff.",
      },
    ],
    options: [
      {
        option_id: "opt_1_1",
        description: "Interview the night security guards first",
        next_scene: "scene_2",
      },
      {
        option_id: "opt_1_2",
        description: "Examine the security footage in detail",
        next_scene: "scene_3",
      },
      {
        option_id: "opt_1_3",
        description: "Speak with Dr. Moreau, the chief curator",
        next_scene: "scene_4",
      },
      {
        option_id: "opt_1_4",
        description: "Investigate the museum's recent acquisitions",
        next_scene: "scene_5",
      },
    ],
  },
  {
    scene_id: "scene_2",
    narration:
      "The security office is a cramped space filled with monitors displaying feeds from hundreds of cameras throughout the Louvre's vast corridors and galleries. Guard Captain Henri Rousseau, a weathered man in his fifties with tired eyes, reviews the footage with you while his colleague, young Marcel Petit, shifts nervously in the corner. The timestamp shows 10:47 PM when Rousseau made his final rounds, checking each gallery methodically as he has done for the past fifteen years. Marcel, who started working at the museum only three months ago, was stationed at the main entrance throughout the night, monitoring the central security panel. As you watch the grainy footage, you notice something peculiar: there's a brief moment around 2:30 AM where the camera feed from the Renaissance wing flickers and goes dark for exactly forty-seven seconds. When it returns, everything appears normal, but you can't shake the feeling that this brief blackout is significant. Rousseau insists that no alarms were triggered during his shift, and the electronic logs show no unauthorized entries. However, Marcel seems increasingly uncomfortable as you question them, his hands fidgeting with his security badge.",
    dialogues: [
      {
        character: "Captain Rousseau",
        speech:
          "I've been guarding these halls for fifteen years, Detective. Nothing gets past me. I checked every gallery, every door, every window.",
      },
      {
        character: "Detective Dubois",
        speech: "What about this camera blackout at 2:30 AM? That seems rather convenient timing.",
      },
      {
        character: "Marcel Petit",
        speech:
          "I... I remember that. The system said it was just a routine maintenance reset. It happens sometimes with the older cameras.",
      },
      {
        character: "Captain Rousseau",
        speech:
          "Marcel's right. The Renaissance wing cameras are due for replacement. But I was in that area around 2:15 AM - everything was secure.",
      },
      {
        character: "Detective Dubois",
        speech: "Marcel, you seem nervous. Is there something you're not telling me about last night?",
      },
    ],
    background_audio: "tension",
    clues: [
      {
        clue_id: "camera_blackout",
        name: "Camera Blackout",
        description:
          "A suspicious 47-second blackout of the Renaissance wing security cameras at exactly 2:30 AM, coinciding with the estimated time of the theft.",
      },
      {
        clue_id: "nervous_guard",
        name: "Nervous Guard",
        description:
          "Marcel Petit's unusual nervousness and fidgeting behavior during questioning, suggesting he may know more than he's revealing.",
      },
      {
        clue_id: "maintenance_reset",
        name: "Maintenance Reset",
        description:
          "The system's explanation for the camera blackout as a routine maintenance reset, though no maintenance was officially scheduled.",
      },
    ],
    options: [
      {
        option_id: "opt_2_1",
        description: "Press Marcel about his nervousness",
        next_scene: "scene_6",
      },
      {
        option_id: "opt_2_2",
        description: "Examine the camera maintenance logs",
        next_scene: "scene_7",
      },
      {
        option_id: "opt_2_3",
        description: "Check the Renaissance wing for physical evidence",
        next_scene: "scene_8",
      },
      {
        option_id: "opt_2_4",
        description: "Interview other museum staff about Marcel",
        next_scene: "scene_9",
      },
    ],
  },
  {
    scene_id: "scene_3",
    narration:
      "In the museum's high-tech surveillance center, you spend hours meticulously reviewing footage from multiple camera angles, searching for any anomaly that might explain the impossible theft. The Louvre's security system is state-of-the-art, with motion sensors, pressure plates, and infrared beams creating an intricate web of protection around each priceless artwork. As you scrub through the timeline, you notice several interesting details: at 11:15 PM, a figure in a maintenance uniform appears briefly in the corridor outside the Renaissance wing, but the image is too blurry to make out facial features. The person carries what appears to be a standard cleaning cart, nothing unusual for the night maintenance crew. However, when you cross-reference this with the maintenance schedule provided by the museum administration, you discover that no cleaning was scheduled for that wing on that particular night. The figure disappears from view around the corner, and despite checking multiple camera angles, you cannot track their movements further. Most intriguingly, the timestamp on several cameras shows a slight discrepancy - some are running three minutes and twenty-seven seconds behind others, suggesting possible tampering with the system's internal clock. This level of technical sophistication indicates that the thief had intimate knowledge of the museum's security infrastructure.",
    dialogues: [
      {
        character: "Security Technician",
        speech:
          "Detective, I've never seen anything like this. The timestamp discrepancies suggest someone with advanced knowledge of our system.",
      },
      {
        character: "Detective Dubois",
        speech:
          "Who would have access to modify the camera timestamps? This isn't something an amateur could accomplish.",
      },
      {
        character: "Security Technician",
        speech:
          "Only our IT department and the security company that installed the system. But they're all thoroughly vetted.",
      },
      {
        character: "Detective Dubois",
        speech: "What about this maintenance worker at 11:15 PM? Can you enhance the image?",
      },
      {
        character: "Security Technician",
        speech:
          "I'll try, but the resolution is poor. However, I notice they're using a cart that was reported missing from storage two weeks ago.",
      },
    ],
    background_audio: "surveillance",
    clues: [
      {
        clue_id: "timestamp_discrepancy",
        name: "Timestamp Discrepancy",
        description:
          "Inconsistencies in the camera timestamps, with some cameras running several seconds behind others, indicating possible tampering.",
      },
      {
        clue_id: "fake_maintenance",
        name: "Fake Maintenance",
        description:
          "A figure in a maintenance uniform appearing on security footage at 11:15 PM, despite no maintenance being scheduled for that night.",
      },
      {
        clue_id: "missing_cart",
        name: "Missing Cart",
        description:
          "The maintenance worker using a cart that was reported missing from storage two weeks prior to the theft.",
      },
    ],
    options: [
      {
        option_id: "opt_3_1",
        description: "Investigate the missing maintenance cart",
        next_scene: "scene_6",
      },
      {
        option_id: "opt_3_2",
        description: "Check the IT department's access logs",
        next_scene: "scene_7",
      },
      {
        option_id: "opt_3_3",
        description: "Interview the security company employees",
        next_scene: "scene_8",
      },
      {
        option_id: "opt_3_4",
        description: "Examine the maintenance uniform storage",
        next_scene: "scene_9",
      },
    ],
  },
  {
    scene_id: "scene_4",
    narration:
      "Dr. Céleste Moreau's office is a testament to her passion for Renaissance art, with reproductions of masterpieces covering every wall and art history books stacked high on her mahogany desk. As the Louvre's chief curator for over two decades, she has an encyclopedic knowledge of every piece in the museum's collection and has personally overseen the acquisition of dozens of priceless works. Her reaction to the theft is one of genuine anguish, as if she has lost a dear friend rather than simply a valuable painting. She explains that 'La Belle Ferronnière' was scheduled to be moved to a special climate-controlled storage facility next week for conservation work, a detail that was known only to a select few museum officials. As she speaks, you notice her hands shake slightly when she mentions the painting's provenance, and she seems particularly distressed about recent rumors in the art world regarding the authenticity of several Renaissance works. Dr. Moreau reveals that she has been receiving anonymous letters over the past month, questioning her expertise and suggesting that some of the Louvre's most prized possessions might be elaborate forgeries. The letters, written in the same elegant script as the card left at the crime scene, have been causing her considerable stress and sleepless nights. She admits that she has been conducting private research to verify the authenticity of several works, including the stolen painting.",
    dialogues: [
      {
        character: "Dr. Moreau",
        speech:
          "Detective, this painting was like a child to me. I've studied every brushstroke, every crack in the varnish. Its loss is... devastating.",
      },
      {
        character: "Detective Dubois",
        speech:
          "You mentioned anonymous letters questioning the authenticity of museum pieces. Can you show me these letters?",
      },
      {
        character: "Dr. Moreau",
        speech:
          "They're here in my desk. The handwriting is identical to the card left at the crime scene. Someone is trying to undermine my life's work.",
      },
      {
        character: "Detective Dubois",
        speech: "Who knew about the planned move to storage? That seems like valuable information for a thief.",
      },
      {
        character: "Dr. Moreau",
        speech:
          "Only myself, Director Beaumont, and the conservation team. But surely you don't suspect... oh, this is all my fault for not being more careful.",
      },
    ],
    background_audio: "classical",
    clues: [
      {
        clue_id: "anonymous_letters",
        name: "Anonymous Letters",
        description:
          "A series of anonymous letters received by Dr. Moreau, questioning the authenticity of several Renaissance works in the Louvre.",
      },
      {
        clue_id: "planned_storage_move",
        name: "Planned Storage Move",
        description:
          "The fact that 'La Belle Ferronnière' was scheduled to be moved to a climate-controlled storage facility the following week.",
      },
      {
        clue_id: "authenticity_doubts",
        name: "Authenticity Doubts",
        description:
          "Rumors circulating in the art world regarding the authenticity of several Renaissance works, including the stolen painting.",
      },
    ],
    options: [
      {
        option_id: "opt_4_1",
        description: "Analyze the handwriting on the anonymous letters",
        next_scene: "scene_6",
      },
      {
        option_id: "opt_4_2",
        description: "Interview the conservation team",
        next_scene: "scene_7",
      },
      {
        option_id: "opt_4_3",
        description: "Investigate Dr. Moreau's recent research",
        next_scene: "scene_8",
      },
      {
        option_id: "opt_4_4",
        description: "Check if other museums have received similar letters",
        next_scene: "scene_9",
      },
    ],
  },
  {
    scene_id: "scene_5",
    narration:
      "The museum's acquisition records reveal a fascinating web of recent purchases and donations that paint a complex picture of the international art market. Over the past six months, the Louvre has acquired three significant Renaissance pieces through a prominent art dealer named Vincent Delacroix, whose gallery on the Right Bank has become increasingly influential in Parisian art circles. Delacroix's transactions show an unusual pattern: he has been aggressively pursuing works from the same period as the stolen painting, often outbidding established collectors and institutions with seemingly unlimited resources. Your investigation reveals that Delacroix has a complicated history with the Louvre - five years ago, he was involved in a bitter legal dispute over the attribution of a Caravaggio painting, which he claimed the museum had acquired through questionable means. The case was settled out of court, but sources suggest that Delacroix harbored deep resentment toward the institution and its curators. More intriguingly, financial records show that Delacroix has been experiencing significant cash flow problems recently, with several major deals falling through and creditors becoming increasingly aggressive. His gallery's insurance policies have been mysteriously increased over the past month, and he has been making inquiries about private collectors who prefer to acquire art through unconventional channels. The timing of these activities, coinciding with the theft, raises serious questions about his potential involvement.",
    dialogues: [
      {
        character: "Museum Registrar",
        speech:
          "Detective, Vincent Delacroix has been quite active lately. Three major acquisitions in six months - that's unusual even for someone of his stature.",
      },
      {
        character: "Detective Dubois",
        speech: "Tell me about this legal dispute five years ago. What exactly happened with the Caravaggio?",
      },
      {
        character: "Museum Registrar",
        speech:
          "Delacroix claimed we knowingly purchased a work with questionable provenance. He was quite vocal about it, accused us of damaging his reputation.",
      },
      { character: "Detective Dubois", speech: "And his recent financial troubles? How severe are they?" },
      {
        character: "Museum Registrar",
        speech:
          "From what I hear through the art world grapevine, quite severe. Desperate men sometimes do desperate things, Detective.",
      },
    ],
    background_audio: "paperwork",
    clues: [
      {
        clue_id: "delacroix_acquisitions",
        name: "Delacroix Acquisitions",
        description:
          "The Louvre's recent acquisition of three significant Renaissance pieces through art dealer Vincent Delacroix.",
      },
      {
        clue_id: "legal_dispute",
        name: "Legal Dispute",
        description:
          "Vincent Delacroix's bitter legal dispute with the Louvre five years ago over the attribution of a Caravaggio painting.",
      },
      {
        clue_id: "financial_troubles",
        name: "Financial Troubles",
        description:
          "Vincent Delacroix's recent financial difficulties, including cash flow problems and increased insurance policies.",
      },
    ],
    options: [
      {
        option_id: "opt_5_1",
        description: "Visit Delacroix's gallery immediately",
        next_scene: "scene_6",
      },
      {
        option_id: "opt_5_2",
        description: "Investigate the Caravaggio dispute further",
        next_scene: "scene_7",
      },
      {
        option_id: "opt_5_3",
        description: "Check Delacroix's recent insurance claims",
        next_scene: "scene_8",
      },
      {
        option_id: "opt_5_4",
        description: "Interview other art dealers about Delacroix",
        next_scene: "scene_9",
      },
    ],
  },
  {
    scene_id: "scene_6",
    narration:
      "Your investigation leads you deeper into the labyrinthine world of art theft and deception, where nothing is quite as it appears on the surface. The evidence you've gathered begins to form a clearer picture, but several crucial pieces of the puzzle remain frustratingly elusive. Marcel Petit's nervous behavior becomes more pronounced under questioning, and he eventually admits to accepting a small bribe from an unknown individual to temporarily disable the camera in the Renaissance wing during his shift. He claims he thought it was just someone wanting to take unauthorized photographs, not commit a major theft, and his genuine distress suggests he's telling the truth about his limited involvement. The missing maintenance cart is discovered in a storage room three floors below the Renaissance wing, wiped clean of fingerprints but containing traces of a specialized art handling foam used to protect valuable paintings during transport. Vincent Delacroix's gallery, when you visit it, appears to be in the midst of a hasty reorganization, with several empty spaces on the walls where paintings once hung and packing materials scattered throughout the showroom. Delacroix himself is nowhere to be found, and his assistant claims he left suddenly for an 'urgent business trip' to Switzerland, a country known for its discrete private banking and art storage facilities. The handwriting analysis of the anonymous letters reveals they were written by someone with formal training in calligraphy, suggesting an educated individual with artistic sensibilities.",
    dialogues: [
      {
        character: "Marcel Petit",
        speech:
          "I swear, Detective, I thought it was just some art student wanting to sketch the paintings! They gave me 500 euros just to turn off one camera for an hour.",
      },
      { character: "Detective Dubois", speech: "Describe this person who bribed you. Every detail you can remember." },
      {
        character: "Marcel Petit",
        speech:
          "They wore a hat and kept their face hidden. But they knew exactly which camera to disable and when. This wasn't random.",
      },
      {
        character: "Gallery Assistant",
        speech:
          "Monsieur Delacroix left very suddenly yesterday morning. He seemed... agitated. Said something about a once-in-a-lifetime opportunity.",
      },
      {
        character: "Detective Dubois",
        speech: "What about these empty spaces on the walls? Were there paintings here recently?",
      },
    ],
    background_audio: "suspense",
    clues: [
      {
        clue_id: "bribed_guard",
        name: "Bribed Guard",
        description:
          "Marcel Petit's admission of accepting a bribe to disable the camera in the Renaissance wing during his shift.",
      },
      {
        clue_id: "art_handling_foam",
        name: "Art Handling Foam",
        description:
          "Traces of specialized art handling foam found in the missing maintenance cart, suggesting it was used to transport the stolen painting.",
      },
      {
        clue_id: "delacroix_fled",
        name: "Delacroix Fled",
        description:
          "Vincent Delacroix's sudden departure for Switzerland, a country known for its discrete private banking and art storage facilities.",
      },
    ],
    options: [
      {
        option_id: "opt_6_1",
        description: "Track Delacroix's movements to Switzerland",
        next_scene: "scene_10",
      },
      {
        option_id: "opt_6_2",
        description: "Analyze the art handling foam for more clues",
        next_scene: "scene_7",
      },
      {
        option_id: "opt_6_3",
        description: "Interview the person who trained Marcel",
        next_scene: "scene_8",
      },
      {
        option_id: "opt_6_4",
        description: "Check international art theft databases",
        next_scene: "scene_9",
      },
    ],
  },
  {
    scene_id: "scene_7",
    narration:
      "The forensic analysis of the art handling foam reveals a crucial breakthrough that shifts the entire direction of your investigation. The foam contains microscopic fibers that match a very specific type of silk used in high-end art restoration work, available only from a handful of specialized suppliers worldwide. More importantly, embedded within the foam are traces of a unique varnish compound that was developed exclusively for the conservation of Renaissance paintings and is used by only three institutions in Europe - one of which is the Louvre's own conservation laboratory. This discovery suggests that the theft was an inside job involving someone with intimate knowledge of art handling procedures and access to specialized materials. The IT department's access logs reveal that someone used Dr. Moreau's credentials to modify the camera system's timestamp settings three days before the theft, but the login occurred at 3 AM when Dr. Moreau was documented to be at a conference in Rome. The security company's employee records show that one of their technicians, Jean-Baptiste Mercier, has been making unauthorized visits to the museum outside of his scheduled maintenance windows, claiming to be conducting 'preventive diagnostics' on the security system. Mercier's background check reveals a fascinating detail: he studied art history before switching to security technology, and his thesis was on the authentication methods used to verify Renaissance paintings. The convergence of technical expertise and art historical knowledge makes him a person of significant interest in the investigation.",
    dialogues: [
      {
        character: "Forensic Analyst",
        speech:
          "Detective, this varnish compound is like a fingerprint. Only three places in Europe use it, and the Louvre is one of them.",
      },
      {
        character: "Detective Dubois",
        speech:
          "So our thief either works here or has access to our conservation materials. That narrows it down considerably.",
      },
      {
        character: "IT Specialist",
        speech:
          "The timestamp modification was definitely done with Dr. Moreau's credentials, but she was in Rome. Someone cloned her access.",
      },
      {
        character: "Detective Dubois",
        speech: "What about this Jean-Baptiste Mercier? His unauthorized visits seem suspicious.",
      },
      {
        character: "Security Manager",
        speech:
          "Mercier is one of our best technicians, but he has been asking a lot of questions about our art handling procedures lately.",
      },
    ],
    background_audio: "laboratory",
    clues: [
      {
        clue_id: "conservation_varnish",
        name: "Conservation Varnish",
        description:
          "Traces of a unique varnish compound found in the art handling foam, used exclusively for the conservation of Renaissance paintings and used by the Louvre.",
      },
      {
        clue_id: "cloned_credentials",
        name: "Cloned Credentials",
        description:
          "The IT department's discovery that someone used Dr. Moreau's credentials to modify the camera system's timestamp settings while she was in Rome.",
      },
      {
        clue_id: "mercier_visits",
        name: "Mercier Visits",
        description:
          "Jean-Baptiste Mercier's unauthorized visits to the museum outside of his scheduled maintenance windows.",
      },
    ],
    options: [
      {
        option_id: "opt_7_1",
        description: "Confront Jean-Baptiste Mercier directly",
        next_scene: "scene_10",
      },
      {
        option_id: "opt_7_2",
        description: "Set up surveillance on the conservation lab",
        next_scene: "scene_8",
      },
      {
        option_id: "opt_7_3",
        description: "Check Mercier's art history thesis",
        next_scene: "scene_9",
      },
      {
        option_id: "opt_7_4",
        description: "Interview Dr. Moreau about her stolen credentials",
        next_scene: "scene_6",
      },
    ],
  },
  {
    scene_id: "scene_8",
    narration:
      "The conservation laboratory hidden in the basement levels of the Louvre is a world unto itself, filled with microscopes, chemical baths, and climate-controlled chambers where priceless artworks undergo meticulous restoration. Your surveillance of the area reveals that Jean-Baptiste Mercier has been making regular visits here, ostensibly to maintain the environmental control systems but actually spending considerable time examining the authentication equipment used to verify the age and composition of paintings. The lab's director, Dr. Elisabeth Fontaine, expresses concern about Mercier's unusual interest in their work, particularly his questions about how to detect and replicate the aging processes that give Renaissance paintings their distinctive characteristics. A thorough search of Mercier's work area uncovers a hidden compartment containing detailed photographs of 'La Belle Ferronnière,' including close-up shots of the painting's signature, brushwork patterns, and areas of deliberate damage that art historians use for authentication purposes. More damning still, you discover a partially completed forgery of the stolen painting, executed with remarkable skill but lacking the subtle imperfections that would make it truly convincing to experts. The forgery is painted on a canvas that has been artificially aged using techniques that Mercier could have learned from observing the conservation team's work. However, as you examine the evidence more closely, you realize that while Mercier clearly intended to create a forgery, the theft itself required a level of coordination and inside knowledge that suggests he was not working alone.",
    dialogues: [
      {
        character: "Dr. Fontaine",
        speech:
          "Jean-Baptiste has been asking very specific questions about our authentication methods. I thought he was just curious, but now...",
      },
      {
        character: "Detective Dubois",
        speech:
          "This forgery is remarkably skilled. Mercier clearly has artistic talent beyond his technical abilities.",
      },
      {
        character: "Dr. Fontaine",
        speech:
          "The aging techniques used on this canvas are exactly what we use in our restoration work. He's been watching and learning.",
      },
      {
        character: "Detective Dubois",
        speech:
          "But creating a forgery and stealing the original are different crimes. Who else knew about his activities?",
      },
      {
        character: "Conservation Assistant",
        speech:
          "Detective, I saw him here late one night with another person. They were discussing something about 'the switch' but I didn't think much of it.",
      },
    ],
    background_audio: "restoration",
    clues: [
      {
        clue_id: "mercier_forgery",
        name: "Mercier Forgery",
        description: "The discovery of a partially completed forgery of 'La Belle Ferronnière' in Mercier's work area.",
      },
      {
        clue_id: "authentication_photos",
        name: "Authentication Photos",
        description:
          "Detailed photographs of 'La Belle Ferronnière,' including close-up shots of the painting's signature and brushwork patterns, found in Mercier's possession.",
      },
      {
        clue_id: "accomplice_mentioned",
        name: "Accomplice Mentioned",
        description:
          "A conservation assistant's statement about seeing Mercier late one night with another person, discussing something about 'the switch.'",
      },
    ],
    options: [
      {
        option_id: "opt_8_1",
        description: "Find out who Mercier's accomplice was",
        next_scene: "scene_10",
      },
      {
        option_id: "opt_8_2",
        description: "Analyze the forgery for more clues",
        next_scene: "scene_9",
      },
      {
        option_id: "opt_8_3",
        description: "Check security footage of Mercier's late-night visits",
        next_scene: "scene_7",
      },
      {
        option_id: "opt_8_4",
        description: "Confront the conservation assistant about what they saw",
        next_scene: "scene_6",
      },
    ],
  },
  {
    scene_id: "scene_9",
    narration:
      "The final pieces of the puzzle begin to fall into place as you uncover the sophisticated network behind the Louvre theft, revealing a conspiracy that goes far deeper than a simple art heist. Jean-Baptiste Mercier's art history thesis, titled 'The Economics of Authentication: How Market Forces Shape Art Historical Truth,' provides crucial insight into his motivations and methods. The thesis argues that the art world's authentication processes are fundamentally flawed and that many 'priceless' works in major museums are actually sophisticated forgeries that have been accepted as authentic through institutional bias and financial pressure. More importantly, the thesis specifically mentions 'La Belle Ferronnière' as a painting whose attribution to Leonardo da Vinci has been questioned by several scholars but dismissed by museums unwilling to acknowledge potential errors in their collections. Your investigation reveals that Mercier had been in contact with Vincent Delacroix for over a year, not as co-conspirators in a theft, but as collaborators in an elaborate scheme to expose what they believed to be widespread fraud in the art authentication industry. The plan was audacious: steal the original painting, replace it temporarily with Mercier's forgery, and then reveal the switch to demonstrate how easily even the world's most prestigious museum could be deceived. However, the plan went awry when Dr. Moreau's private research began to uncover inconsistencies in the painting's provenance, threatening to expose their scheme before they could reveal it on their own terms. The anonymous letters were Delacroix's attempt to pressure her into abandoning her investigation, but her persistence forced them to accelerate their timeline.",
    dialogues: [
      {
        character: "Art History Professor",
        speech:
          "Jean-Baptiste's thesis was controversial but brilliant. He genuinely believed he was exposing corruption in the art world.",
      },
      {
        character: "Detective Dubois",
        speech: "So this wasn't about money - it was about proving a point. But where is the original painting now?",
      },
      {
        character: "Swiss Bank Official",
        speech:
          "Monsieur Delacroix deposited a package in our vault yesterday, but he left specific instructions that it not be opened for one week.",
      },
      {
        character: "Detective Dubois",
        speech:
          "One week... just enough time for the forgery to be discovered and the scandal to break. They wanted to be caught.",
      },
      {
        character: "Mercier's Colleague",
        speech:
          "He kept saying that sometimes you have to break the rules to expose the truth. I thought he was just being philosophical.",
      },
    ],
    background_audio: "intellectual",
    clues: [
      {
        clue_id: "thesis_revelation",
        name: "Thesis Revelation",
        description:
          "The revelation that Jean-Baptiste Mercier's art history thesis argued that the art world's authentication processes are fundamentally flawed.",
      },
      {
        clue_id: "delacroix_package",
        name: "Delacroix Package",
        description:
          "The discovery that Vincent Delacroix deposited a package in a Swiss bank vault, with instructions that it not be opened for one week.",
      },
      {
        clue_id: "planned_exposure",
        name: "Planned Exposure",
        description:
          "The realization that Mercier and Delacroix planned to expose what they believed to be widespread fraud in the art authentication industry.",
      },
    ],
    options: [
      {
        option_id: "opt_9_1",
        description: "Race to Switzerland to recover the painting",
        next_scene: "scene_10",
      },
      {
        option_id: "opt_9_2",
        description: "Confront Dr. Moreau about her research findings",
        next_scene: "scene_10",
      },
      {
        option_id: "opt_9_3",
        description: "Examine the forgery more closely for the final clue",
        next_scene: "scene_10",
      },
      {
        option_id: "opt_9_4",
        description: "Check if other museums have similar authentication issues",
        next_scene: "scene_10",
      },
    ],
  },
  {
    scene_id: "scene_10",
    narration:
      "In the climactic resolution of the case, you stand once again before the empty frame in the Louvre's Renaissance wing, but now with complete understanding of the complex motivations and meticulous planning that led to this moment. The original 'La Belle Ferronnière' has been recovered from the Swiss bank vault, exactly where Delacroix intended it to be found, and Jean-Baptiste Mercier has been arrested at Charles de Gaulle Airport attempting to board a flight to New York where he planned to present his findings at an international art authentication conference. The subtle but critical clue that ultimately solved the case was hidden in plain sight: the mysterious card left at the crime scene contained a watermark visible only under ultraviolet light, revealing the logo of a small art supply shop in Montmartre where Mercier had purchased the materials for his forgery. However, the case's resolution raises profound questions about the nature of authenticity in the art world and the lengths to which passionate individuals will go to expose what they perceive as institutional corruption. Dr. Moreau's research, which inadvertently triggered the accelerated timeline of the theft, has indeed revealed troubling inconsistencies in the painting's provenance that will require years of additional study to resolve. Vincent Delacroix, facing charges of conspiracy and art theft, maintains that his actions were justified by a higher moral purpose, while Mercier's forgery, ironically, demonstrates such remarkable skill that it has sparked new discussions about the relationship between artistic talent and criminal intent. As you file your final report, you reflect on the thin line between preservation and obsession, between protecting cultural heritage and questioning established truths, and wonder whether the art world will learn from this elaborate lesson or simply tighten its security and continue as before.",
    dialogues: [
      {
        character: "Detective Dubois",
        speech:
          "The painting is safe, but the questions you've raised about authentication will haunt the art world for years to come.",
      },
      {
        character: "Jean-Baptiste Mercier",
        speech:
          "Detective, I never intended to keep the painting. I just wanted people to see how easily they could be deceived.",
      },
      {
        character: "Vincent Delacroix",
        speech:
          "The real crime is the complacency of institutions that refuse to question their own assumptions about authenticity.",
      },
      {
        character: "Dr. Moreau",
        speech:
          "Perhaps this incident will force us to be more rigorous in our authentication processes. Some good may come from this chaos.",
      },
      {
        character: "Director Beaumont",
        speech:
          "The Louvre's reputation will recover, but we must learn from this. Security is more than cameras and alarms - it's about understanding human motivation.",
      },
    ],
    background_audio: "resolution",
    clues: [
      {
        clue_id: "watermark_clue",
        name: "Watermark Clue",
        description:
          "The discovery of a watermark on the mysterious card left at the crime scene, revealing the logo of an art supply shop in Montmartre.",
      },
      {
        clue_id: "recovered_painting",
        name: "Recovered Painting",
        description: "The recovery of the original 'La Belle Ferronnière' from the Swiss bank vault.",
      },
      {
        clue_id: "moral_questions",
        name: "Moral Questions",
        description:
          "The profound questions raised about the nature of authenticity in the art world and the lengths to which individuals will go to expose perceived corruption.",
      },
    ],
    options: [
      {
        option_id: "opt_10_1",
        description: "Case closed - file the final report",
        next_scene: "case_solved",
      },
      {
        option_id: "opt_10_2",
        description: "Recommend changes to museum security protocols",
        next_scene: "case_solved",
      },
      {
        option_id: "opt_10_3",
        description: "Suggest further investigation into art authentication",
        next_scene: "case_solved",
      },
    ],
  },
]

export default function ArtTheftParisPage() {
  const router = useRouter()
  const [currentScene, setCurrentScene] = useState("scene_1")
  const [discoveredClues, setDiscoveredClues] = useState<Clue[]>([])
  const [sceneHistory, setSceneHistory] = useState<string[]>(["scene_1"])

  const currentSceneData = mockData.find((scene) => scene.scene_id === currentScene)

  useEffect(() => {
    if (currentSceneData) {
      setDiscoveredClues((prev) => {
        const newClues = currentSceneData.clues.filter(
          (clue) => !prev.some((existingClue) => existingClue.clue_id === clue.clue_id),
        )
        return [...prev, ...newClues]
      })
    }
  }, [currentScene, currentSceneData])

  const handleOptionClick = (nextScene: string) => {
    if (nextScene === "case_solved") {
      alert(
        "Case Solved! Jean-Baptiste Mercier and Vincent Delacroix orchestrated the theft to expose authentication fraud in the art world.",
      )
      return
    }

    setSceneHistory((prev) => [...prev, nextScene])
    setCurrentScene(nextScene)
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

  if (!currentSceneData) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Accessing Louvre archives...</p>
        <style jsx>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #7f1d1d, #d97706);
            color: #fbbf24;
            font-family: serif;
          }
          .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(251, 191, 36, 0.3);
            border-top: 3px solid #fbbf24;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      <div className="case-container">
        <div className="case-header">
          <h1>The Louvre Heist</h1>
          <p className="subtitle">A Masterpiece of Deception</p>
          <div className="status-bar">
            <div className="clues-counter">
              <span className="label">EVIDENCE:</span>
              <span className="count">{discoveredClues.length}</span>
            </div>
            <div className="scene-indicator">
              <span className="label">SCENE:</span>
              <span className="scene-id">{currentScene.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="scene-content">
          {sceneHistory.length > 1 && (
            <button className="scene-back-button" onClick={handleBackToScene}>
              ← PREVIOUS SCENE
            </button>
          )}

          <div className="narration-box">
            <div className="section-header">
              <span className="icon">🏛️</span>
              <h3>INVESTIGATION NOTES</h3>
            </div>
            <p className="narration">{currentSceneData.narration}</p>
          </div>

          {currentSceneData.dialogues && currentSceneData.dialogues.length > 0 && (
            <div className="dialogue-section">
              <div className="section-header">
                <span className="icon">💬</span>
                <h3>CONVERSATIONS</h3>
              </div>
              {currentSceneData.dialogues.map((dialogue, index) => (
                <div key={index} className="dialogue-item">
                  <div className="character-tag">{dialogue.character}</div>
                  <div className="speech-bubble">"{dialogue.speech}"</div>
                </div>
              ))}
            </div>
          )}

          {currentSceneData.clues && currentSceneData.clues.length > 0 && (
            <div className="clues-section">
              <div className="section-header">
                <span className="icon">🔍</span>
                <h3>EVIDENCE DISCOVERED</h3>
              </div>
              {currentSceneData.clues.map((clue, index) => (
                <div key={index} className="clue-item">
                  <div className="clue-header">
                    <strong className="clue-name">{clue.name.toUpperCase()}</strong>
                    <span className="clue-status">VERIFIED</span>
                  </div>
                  <p className="clue-description">{clue.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="options-section">
            <div className="section-header">
              <span className="icon">⚖️</span>
              <h3>NEXT ACTION</h3>
            </div>
            <div className="options-grid">
              {currentSceneData.options.map((option, index) => (
                <button key={index} className="option-btn" onClick={() => handleOptionClick(option.next_scene)}>
                  <span className="option-text">{option.description}</span>
                  <div className="btn-glow"></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {discoveredClues.length > 0 && (
          <div className="evidence-sidebar">
            <div className="sidebar-header">
              <h3>CASE FILES</h3>
              <div className="connection-status">SECURE</div>
            </div>
            <div className="evidence-list">
              {discoveredClues.map((clue, index) => (
                <div key={index} className="evidence-item">
                  <div className="evidence-icon">📄</div>
                  <div className="evidence-name">{clue.name.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="back-button" onClick={() => router.back()}>
          <span>← RETURN TO CASES</span>
        </button>
      </div>

      <style jsx>{`
        .case-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #7f1d1d, #d97706, #fbbf24);
          color: #fbbf24;
          font-family: serif;
          padding: 20px;
          position: relative;
          overflow-x: hidden;
        }

        .case-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 10px;
          border: 2px solid #fbbf24;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
          backdrop-filter: blur(10px);
        }

        .case-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          color: #fbbf24;
          text-shadow: 0 0 15px rgba(251, 191, 36, 0.8);
          letter-spacing: 2px;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #f59e0b;
          font-style: italic;
          margin-bottom: 15px;
        }

        .status-bar {
          display: flex;
          justify-content: center;
          gap: 40px;
          font-size: 1.1rem;
        }

        .clues-counter, .scene-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .label {
          color: #dc2626;
          font-weight: bold;
        }

        .count, .scene-id {
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.2);
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
          background: rgba(127, 29, 29, 0.7);
          padding: 25px;
          border-radius: 10px;
          border: 1px solid #fbbf24;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
          backdrop-filter: blur(5px);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(251, 191, 36, 0.3);
        }

        .section-header .icon {
          font-size: 1.2rem;
        }

        .section-header h3 {
          margin: 0;
          color: white;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          font-size: 1.2rem;
          letter-spacing: 1px;
        }

        .narration {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #fef3c7;
          font-style: italic;
        }

        .dialogue-item {
          margin: 15px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .character-tag {
          background: linear-gradient(45deg, #dc2626, #fbbf24);
          color: #000;
          padding: 4px 12px;
          border-radius: 15px;
          font-weight: bold;
          font-size: 0.9rem;
          align-self: flex-start;
        }

        .speech-bubble {
          background: rgba(220, 38, 38, 0.1);
          padding: 12px 18px;
          border-radius: 10px;
          border-left: 3px solid #dc2626;
          color: #fef3c7;
          font-style: italic;
        }

        .clues-section {
          border-color: #f59e0b;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
        }

        .clue-item {
          background: rgba(245, 158, 11, 0.1);
          padding: 18px;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid #f59e0b;
        }

        .clue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .clue-name {
          color: #f59e0b;
          font-size: 1.1rem;
        }

        .clue-status {
          background: #f59e0b;
          color: #000;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .clue-description {
          color: #fef3c7;
          margin: 0;
          line-height: 1.5;
        }

        .options-grid {
          display: grid;
          gap: 15px;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .option-btn {
          background: linear-gradient(45deg, #dc2626, #f59e0b);
          color: #000;
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
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
        }

        .btn-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
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
          background: rgba(127, 29, 29, 0.9);
          padding: 20px;
          border-radius: 10px;
          border: 2px solid #f59e0b;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
          backdrop-filter: blur(10px);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f59e0b;
        }

        .sidebar-header h3 {
          color: #f59e0b;
          margin: 0;
          font-size: 1.1rem;
        }

        .connection-status {
          background: #fbbf24;
          color: #000;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .evidence-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(245, 158, 11, 0.1);
          padding: 10px;
          margin: 8px 0;
          border-radius: 5px;
          font-size: 0.9rem;
        }

        .evidence-icon {
          font-size: 1.1rem;
        }

        .evidence-name {
          color: #fef3c7;
        }

        .back-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: transparent;
          border: 2px solid #fbbf24;
          color: #fbbf24;
          padding: 15px 25px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: serif;
        }

        .back-button:hover {
          background: #fbbf24;
          color: #7f1d1d;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          transform: scale(1.05);
        }

        .scene-back-button {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          border: 2px solid #fbbf24;
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
          background: #fbbf24;
          color: #7f1d1d;
          transform: translateX(-5px);
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
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
  )
}
