
import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client using the correct named parameter and directly referencing process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getArticleSummary = async (content: string): Promise<string> => {
  try {
    // Generate a summary using the recommended Gemini 3 Flash model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following tech article content into a concise 3-sentence TL;DR for a blog reader: \n\n ${content}`,
      config: {
        // Correctly using systemInstruction to define the model's persona.
        systemInstruction: "You are a professional tech editor.",
        // Setting thinkingBudget to 0 for lower latency on simple summarization tasks.
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Accessing .text as a property, not a method, as per the correct SDK usage.
    return response.text || "Summary unavailable at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate a summary.";
  }
};
