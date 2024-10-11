
import { GoogleGenerativeAI } from "@google/generative-ai";

const searchForPrompt = async (prompt: string): Promise<string>=>{
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);

  return result.response.text();
}

export default searchForPrompt;