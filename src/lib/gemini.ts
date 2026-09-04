import "server-only";
import { parseFoodAnalysisResponse, type FoodAnalysisResult } from "./foodAnalysisSchema";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const ANALYSIS_PROMPT = `Analyze the food shown in this image.

Identify the visible food items and estimate the nutritional values for the entire serving.

Return ONLY valid JSON.

Use this exact structure:

{
  "food_name": "",
  "description": "",
  "estimated_portion": "",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0,
  "fiber": 0,
  "confidence": ""
}

Rules:

- Estimate the nutrition for the portion visible in the image.
- If multiple foods are present, calculate the combined total.
- Use reasonable estimates.
- Do not include markdown.
- Do not include explanations outside JSON.
- If the image does not contain recognizable food, return an appropriate JSON response with zero values and low confidence.
- "confidence" must be exactly one of: "low", "medium", "high".`;

const RETRYABLE_STATUS_CODES = new Set([429, 503]);
const MAX_ATTEMPTS = 3;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGemini(imageBase64: string, mimeType: string, apiKey: string): Promise<Response> {
  return fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
            { text: ANALYSIS_PROMPT },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
      },
    }),
  });
}

export async function analyzeFoodImage(imageBase64: string, mimeType: string): Promise<FoodAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured on the server.");
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const response = await callGemini(imageBase64, mimeType, apiKey);

    if (response.ok) {
      const data = await response.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.find(
        (p: { text?: string }) => typeof p.text === "string"
      )?.text;

      if (!text) {
        throw new Error("Gemini did not return any analyzable content.");
      }

      return parseFoodAnalysisResponse(text);
    }

    const errorBody = await response.text().catch(() => "");
    lastError = new Error(`Gemini API request failed (${response.status}): ${errorBody.slice(0, 300)}`);

    if (!RETRYABLE_STATUS_CODES.has(response.status) || attempt === MAX_ATTEMPTS) {
      throw lastError;
    }

    // Gemini's 429/503 responses are explicitly transient ("try again later") — back off and retry.
    await sleep(1000 * attempt);
  }

  throw lastError ?? new Error("Gemini API request failed.");
}
