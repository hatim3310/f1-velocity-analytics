import { GoogleGenAI } from "@google/genai";
import { RaceAnalysisData } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateRaceInsight = async (data: RaceAnalysisData, query: string): Promise<string> => {
  if (!apiKey) {
    return "Connect API Key to Pit Wall.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const winner = data.drivers.find(d => d.id === data.race.winnerId)?.name || "TBD";
    
    // Create a compact, data-heavy context for the model
    const contextLaps = data.history.filter(h => h.lap % 5 === 0 || h.lap === 1 || h.lap === data.race.laps);
    const leaderHistory = data.history.filter(h => h.position === 1);
    
    const prompt = `
      ROLE: You are a Senior F1 Race Strategy Engineer sitting on the Pit Wall.
      TONE: Technical, High-Pressure, Radio-Comms style. Concise. No fluff.
      KEYWORD USAGE: "Box window", "Undercut", "Overcut", "Tyre Deg", "Delta", "Purple Sector", "Traffic".

      RACE DATA:
      Grand Prix: ${data.race.name}
      Circuit: ${data.race.circuit}
      Laps: ${data.race.laps}
      Winner: ${winner}
      
      TELEMETRY SUMMARY:
      - Track Eval: High degradation expected.
      - Grid: ${data.drivers.length} cars.
      
      USER QUERY FROM TEAM PRINCIPAL: "${query}"

      INSTRUCTIONS:
      1. Answer directly based on race physics and strategy.
      2. If data is ambiguous, assume standard high-downforce setups.
      3. Format response using Markdown (bold key terms).
      4. Keep it under 100 words. Start with "Copy that," or "Telemetry shows...".
    `;

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
