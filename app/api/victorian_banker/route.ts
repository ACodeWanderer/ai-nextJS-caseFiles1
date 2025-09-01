import { NextResponse } from "next/server"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function POST(_req: Request) {
  // Simulate network latency
  await sleep(450)

  // Return the exact compact JSON structure the client can normalize
  return NextResponse.json({
    story: {
      emotional_state: "FEAR",
      trauma_distortion_level: "MEDIUM",
      internal_monologue:
        "The polished oak floor gleamed under the flickering gaslight, reflecting the horrified faces gathered around… him.  My father.  Lying there, still, the crimson stain spreading like a malevolent flower across his crisp shirt.  My breath hitched, a strangled sob caught in my throat.  Was it the wine?  Or the look in my brother Edward’s eyes? Or was it the way my sister, Clara, clutched her pearls, her usually perfect composure shattered?  I should feel grief, overwhelming grief, but a cold dread is settling over me.  Someone in this room killed him.",
      memory_id: "memory_1",
      decisions: [
        {
          next_memory_id: "memory_2",
          description: "Approach the body, ignoring the unsettling feeling.",
          outcome_type: "DANGEROUS_CONFRONTATION",
          decision_id: "decision_1",
        },
        {
          decision_id: "decision_2",
          next_memory_id: "memory_3",
          description: "Stay back, observe the others, try to find clues.",
          outcome_type: "TEMPORARY_SAFETY",
        },
      ],
    },
  })
}
