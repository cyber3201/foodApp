
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getSmartFoodRecommendation = async (userQuery: string, availableItems: string): Promise<{ message: string, recommendedItemIds: number[] }> => {
  if (!apiKey) {
    return {
      message: "I'm sorry, I can't access my brain right now (API Key missing). But everything looks delicious!",
      recommendedItemIds: []
    };
  }

  try {
    const model = ai.models;
    const prompt = `
      You are an expert Moroccan AI Food Critic for "WEKELNI".
      
      Available Menu Items (format: ID: Name):
      ${availableItems}

      User Query: "${userQuery}"

      Return a JSON object with:
      1. "message": A short, friendly, appetizing response (max 40 words).
      2. "recommendedItemIds": An array of numbers corresponding to the IDs of 1-3 best matching items from the menu.

      Do NOT output markdown code blocks. Just the raw JSON string.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");

    const data = JSON.parse(text);
    return {
      message: data.message || "Here are some great choices!",
      recommendedItemIds: data.recommendedItemIds || []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: "I'm having a little trouble connecting to the kitchen. Try looking at our popular items!",
      recommendedItemIds: []
    };
  }
};
