import { GoogleGenAI } from "@google/genai";
import { Message, Role } from "../types";

// Initialize the API client
// Note: In a production Node.js/Express backend, this logic would reside on the server.
// For this standalone React demo, we implement it client-side.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `You are Aura, a helpful, concise, and professional AI assistant. 
Your responses should be clean, well-structured, and free of unnecessary fluff. 
Use Markdown for formatting where appropriate.`;

export const sendMessageToGemini = async (
  history: Message[], 
  newMessage: string
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Transform history to Gemini format (excluding the very last user message which is 'newMessage')
    // We only send a limited context window for efficiency in this demo
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: recentHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    
    // The SDK guarantees a response object, but we check text existence for safety
    const text = result.text;
    
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with Aura. Please check your connection.");
  }
};