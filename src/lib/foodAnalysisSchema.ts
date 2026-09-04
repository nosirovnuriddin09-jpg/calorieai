import { z } from "zod";

// Gemini occasionally returns numbers as strings or omits fields — coerce
// and default defensively rather than rejecting the whole response.
export const foodAnalysisSchema = z.object({
  food_name: z.string().default("Unknown food"),
  description: z.string().default(""),
  estimated_portion: z.string().default(""),
  calories: z.coerce.number().min(0).default(0),
  protein: z.coerce.number().min(0).default(0),
  carbs: z.coerce.number().min(0).default(0),
  fat: z.coerce.number().min(0).default(0),
  fiber: z.coerce.number().min(0).default(0),
  confidence: z.enum(["low", "medium", "high"]).default("low"),
});

export type FoodAnalysisResult = z.infer<typeof foodAnalysisSchema>;

/**
 * Gemini is asked to return raw JSON but sometimes wraps it in a markdown
 * fence or adds a stray sentence before/after — strip that defensively
 * before parsing, rather than trusting the response is clean JSON.
 */
export function parseFoodAnalysisResponse(rawText: string): FoodAnalysisResult {
  let text = rawText.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned a response that could not be parsed as JSON.");
  }

  const result = foodAnalysisSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new Error("Gemini's response did not match the expected food analysis format.");
  }

  return result.data;
}
