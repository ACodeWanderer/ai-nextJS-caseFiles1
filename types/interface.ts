// Survival Scenario Function Parameter Interface (Single)
export interface SurvivalScenarioParameters {
  scenario_name: string;
  memories: Array<{
    memory_id: string;
    internal_monologue: string;
    emotional_state:
      | "FEAR"
      | "PANIC"
      | "CONFUSION"
      | "DETERMINATION"
      | "RESIGNATION";
    trauma_distortion_level?: "LOW" | "MEDIUM" | "HIGH";
    intuition_prompts?: Array<{
      prompt_id: string;
      prompt_text: string;
    }>;
    decisions: Array<{
      decision_id: string;
      description: string;
      next_memory_id: string;
      outcome_type:
        | "ESCAPE_ROUTE"
        | "DANGEROUS_CONFRONTATION"
        | "TEMPORARY_SAFETY"
        | "INJURY";
    }>;
  }>;
}
// Profiler Function Parameter Interface (Single)
export interface ProfilerParameters {
  case_id: string;
  subjects: Array<{
    subject_id: string;
    behavioral_data_points: Array<{
      data_point_id: string;
      observation_context: string;
      observed_behaviors: string[];
      verbal_cues?: string[];
      deception_likelihood: "LOW" | "MEDIUM" | "HIGH";
    }>;
    psychological_profile: {
      dominant_traits: string[];
      potential_motives: string[];
      predicted_intent: string;
    };
    profiling_actions: Array<{
      action_id: string;
      action_type:
        | "RUN_EMOTION_HEATMAP"
        | "UPDATE_PROFILING_MATRIX"
        | "REQUEST_FURTHER_OBSERVATION";
      action_outcome: string;
    }>;
  }>;
}
// Forensic Case Function Parameter Interface (Single)
export interface ForensicCaseParameters {
  case_name: string;
  exhibits: Array<{
    exhibit_id: string;
    item_description: string;
    collection_location: string;
    contamination_risk: "LOW" | "MEDIUM" | "HIGH";
    available_analyses: Array<{
      analysis_id: string;
      analysis_type:
        | "DNA_ANALYSIS"
        | "FINGERPRINT_ANALYSIS"
        | "CHEMICAL_ANALYSIS"
        | "UV_SCANNING";
      results: {
        summary: string;
        is_conclusive: boolean;
        unlocks_new_exhibits?: string[];
      };
    }>;
  }>;
}
// Detective Story Function Parameter Interface (Single)
export interface DetectiveStoryParameters {
  title: string;
  scenes: Array<{
    scene_id: string;
    narration: string;
    dialogues?: Array<{
      character: string;
      speech: string;
    }>;
    background_audio:
      | "silence"
      | "rain"
      | "fireplace"
      | "tension"
      | "mystery"
      | "crime_scene"
      | "funny";
    clues?: Array<{
      clue_id: string;
      name: string;
      description: string;
    }>;
    options: Array<{
      option_id: string;
      description: string;
      next_scene: string;
      required_clues?: string[];
    }>;
  }>;
}
