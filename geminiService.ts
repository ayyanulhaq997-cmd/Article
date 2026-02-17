
import { GoogleGenAI } from "@google/genai";

export const getArticleSummary = async (content: string): Promise<string> => {
  // Defensive check for API_KEY
  if (!process.env.API_KEY || process.env.API_KEY === "undefined") {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return "Summary feature currently unavailable.";
  }

  try {
    // Fix: Always use direct process.env.API_KEY for initialization as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fix: Call generateContent with both model and prompt, using gemini-3-flash-preview for summarization
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following tech article content into a concise 3-sentence TL;DR for a blog reader: \n\n ${content}`,
      config: {
        systemInstruction: "You are a professional tech editor.",
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    // Fix: Use .text property to extract output
    return response.text || "Summary unavailable at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate a summary.";
  }
};
