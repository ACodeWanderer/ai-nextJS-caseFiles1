// Always returns a payload compatible with the provided mock shape.
// You can extend this to branch on the `case` sent from the client.

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const caseName = body?.case || "unknown"

  // Artificial delay to simulate network latency
  await new Promise((r) => setTimeout(r, 350))

  // Minimal, valid survivor story matching the compact single-memory payload.
  // The client normalizes this shape and renders the same UI.
  const payload = {
    story: {
      scenario_name: caseName === "snowy_lodge" ? "Echoes on the Snowy Ridge" : "Survivor Memory",
      emotional_state: "FEAR",
      trauma_distortion_level: "MEDIUM",
      internal_monologue:
        "I awaken to a silence that isn’t silence at all—only the hush of snowfall pressing against the lodge windows. The hearth is dark, and the air smells of pine and iron. My breath fogs as I rise. Outside, the wind drags a lone branch across the eaves like a match striking. Something terrible happened here. I can feel it ringing in my bones.",
      memory_id: "memory_1",
      decisions: [
        {
          decision_id: "d1",
          next_memory_id: "memory_2",
          description: "Light the hearth and steady your shaking hands.",
          outcome_type: "TEMPORARY_SAFETY",
        },
        {
          decision_id: "d2",
          next_memory_id: "memory_3",
          description: "Peer into the corridor where the draught whispers.",
          outcome_type: "DANGEROUS_CONFRONTATION",
        },
      ],
    },
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}
