import { GoogleGenAI } from "@google/genai";
import { RaceAnalysisData } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateRaceInsight = async (data: RaceAnalysisData | null, query: string): Promise<string> => {
  if (!apiKey) {
    return "Connect API Key to Pit Wall.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    let prompt = "";

    if (data) {
      const winner = data.drivers.find(d => d.id === data.race.winnerId)?.name || "TBD";
      const contextLaps = data.history.filter(h => h.lap % 5 === 0 || h.lap === 1 || h.lap === data.race.laps);
      const leaderHistory = data.history.filter(h => h.position === 1);

      prompt = `
          ROLE: You are a Senior F1 Race Strategy Engineer sitting on the Pit Wall.
          TONE: Technical, High-Pressure, Radio-Comms style. Concise. No fluff.
          
          RACE DATA:
          Grand Prix: ${data.race.name}
          Circuit: ${data.race.circuit}
          Winner: ${winner}
          
          TELEMETRY DATA (SAMPLED):
          ${JSON.stringify(contextLaps)}

          RACE LEADER HISTORY:
          ${JSON.stringify(leaderHistory)}
    
          USER QUERY FROM TEAM PRINCIPAL: "${query}"
    
          INSTRUCTIONS:
          1. Answer based on RACE DATA.
          2. Keep it under 100 words. Start with "Copy that," or "Telemetry shows...".
        `;
    } else {
      // GENERAL QUERY MODE (SEARCH BAR)
      prompt = `
          ROLE: You are a Senior F1 Race Strategy Engineer and Historian.
          TONE: Professional, Knowledgeable, F1 Insider.
          
          USER QUERY: "${query}"
          
          INSTRUCTIONS:
          1. Answer general F1 questions (rules, history, 2025 season predictions, driver stats).
          2. If asked about the current App state, say you are analyzing the 2025 Simulated Season.
          3. Keep it concise (< 100 words).
        `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4, // Lower temperature for more analytical/consistent results
      }
    });

    return response.text || "Radio Check. No data.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Radio link unstable. Check connection.";
  }
};
