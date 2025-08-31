"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Choice {
  id: string
  text: string
  consequence: string
  traumaLevel: number
}

interface Scenario {
  id: string
  title: string
  description: string
  internalMonologue: string
  traumaDistortion?: string
  choices: Choice[]
  currentState: "alive" | "injured" | "dead"
}

const initialScenario: Scenario = {
  id: "banker_wife_escape",
  title: "The Banker's Wife",
  description:
    "The grandfather clock in the hallway chimes midnight as you hear your husband's final, strangled cry from his study. The heavy oak door creaks open, and footsteps—deliberate, measured—echo across the marble floor. Your silk nightgown rustles as you press yourself against the cold wall of your bedroom, heart hammering against your ribs like a caged bird.",
  internalMonologue:
    "Charles... oh God, Charles is dead. The killer is still here. I can hear him moving through our home like he owns it. My hands are shaking so violently I can barely think. The servants are gone for the evening. I am utterly alone.",
  traumaDistortion:
    "The shadows seem to writhe and dance in the candlelight. Was that footstep real, or is my mind playing tricks? The portrait of Charles on the mantle seems to be watching me, his painted eyes following my every movement with accusation.",
  choices: [
    {
      id: "hide_wardrobe",
      text: "Hide in the mahogany wardrobe",
      consequence:
        "You slip into the wardrobe among your evening gowns, the scent of lavender and cedar surrounding you. Through the keyhole, you see a shadow pass by your door.",
      traumaLevel: 2,
    },
    {
      id: "window_escape",
      text: "Climb out the second-story window",
      consequence:
        "Your trembling fingers work at the window latch. The drop to the garden below is treacherous, but the ivy-covered trellis might hold your weight.",
      traumaLevel: 4,
    },
    {
      id: "confront_killer",
      text: "Grab the fireplace poker and confront the intruder",
      consequence:
        "You grasp the cold iron poker with both hands. Your wedding ring catches the firelight as you steel yourself to face your husband's murderer.",
      traumaLevel: 5,
    },
    {
      id: "servants_bell",
      text: "Ring the servants' bell frantically",
      consequence:
        "You pull the velvet cord repeatedly, but remember with growing horror that you dismissed the staff early tonight. The bell echoes uselessly through empty corridors.",
      traumaLevel: 3,
    },
  ],
  currentState: "alive",
}

export default function VictorianSurvivalScenario() {
  const [currentScenario, setCurrentScenario] = useState<Scenario>(initialScenario)
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [gameState, setGameState] = useState<"playing" | "consequence" | "ended">("playing")
  const [traumaLevel, setTraumaLevel] = useState(0)

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice)
    setTraumaLevel((prev) => prev + choice.traumaLevel)
    setGameState("consequence")
  }

  const continueStory = () => {
    // In a full implementation, this would load the next scenario
    setGameState("ended")
  }

  useEffect(() => {
    // Add atmospheric sound effects or additional immersion here
    document.body.classList.add("dark")
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="font-victorian text-4xl md:text-6xl font-bold text-primary mb-2 animate-flicker">
            London, 1887
          </h1>
          <p className="text-muted-foreground text-lg font-serif italic">A Tale of Survival and Terror</p>
        </header>

        <Card className="mb-6 border-2 border-primary/20 shadow-2xl">
          <CardHeader className="bg-card/50">
            <CardTitle className="font-victorian text-2xl text-primary flex items-center gap-2">
              {currentScenario.title}
              <span className="text-sm bg-destructive text-destructive-foreground px-2 py-1 rounded">
                Trauma Level: {traumaLevel}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed font-serif text-lg">{currentScenario.description}</p>
            </div>

            <div className="bg-muted/10 border-l-4 border-accent p-4 rounded-r">
              <h3 className="font-victorian text-accent font-semibold mb-2 text-shadow-glow">Your Thoughts:</h3>
              <p className="text-muted-foreground italic font-serif">{currentScenario.internalMonologue}</p>
            </div>

            {currentScenario.traumaDistortion && (
              <div className="bg-destructive/10 border border-destructive/30 p-4 rounded animate-pulse-danger">
                <h3 className="font-victorian text-destructive font-semibold mb-2">Reality Distorts:</h3>
                <p className="text-destructive/80 italic font-serif text-sm">{currentScenario.traumaDistortion}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {gameState === "playing" && (
          <div className="grid gap-4 md:grid-cols-2">
            {currentScenario.choices.map((choice) => (
              <Button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                variant="outline"
                className="h-auto p-4 text-left border-2 border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <div>
                  <div className="font-semibold mb-1 font-victorian">{choice.text}</div>
                  <div className="text-xs text-muted-foreground">Risk Level: {choice.traumaLevel}/5</div>
                </div>
              </Button>
            ))}
          </div>
        )}

        {gameState === "consequence" && selectedChoice && (
          <Card className="border-accent border-2">
            <CardHeader>
              <CardTitle className="font-victorian text-accent">Consequence of Your Choice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-serif leading-relaxed mb-4">{selectedChoice.consequence}</p>
              <Button onClick={continueStory} className="bg-primary hover:bg-primary/90 font-victorian">
                Continue the Tale...
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState === "ended" && (
          <Card className="border-destructive border-2 text-center">
            <CardContent className="p-8">
              <h2 className="font-victorian text-3xl text-destructive mb-4">To Be Continued...</h2>
              <p className="text-muted-foreground font-serif mb-4">
                Your fate hangs in the balance. Will you survive the night in Victorian London?
              </p>
              <Button
                onClick={() => {
                  setGameState("playing")
                  setSelectedChoice(null)
                  setTraumaLevel(0)
                }}
                variant="outline"
                className="font-victorian"
              >
                Begin Again
              </Button>
            </CardContent>
          </Card>
        )}

        <footer className="text-center mt-12 text-muted-foreground">
          <p className="font-serif italic text-sm">"In the gaslight's dying glow, every shadow holds a secret..."</p>
        </footer>
      </div>
    </div>
  )
}
