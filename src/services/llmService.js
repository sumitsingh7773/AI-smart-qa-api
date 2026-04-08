import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY,
});
const responseSchema = z.object({
  answer: z.string(),
  sources: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
});
export const generateAnswer = async (question, docs) => {
  const context = docs.map((d) => d.content).join("\n");

  if (!docs.length) {
    return {
      answer: "Not found in knowledge base",
      sources: [],
      confidence: "low",
    };
  }
  const prompt = `
You are a strict AI assistant.

Answer ONLY using the provided context.
If not found, say "Not found in knowledge base".

Context:
${context}

Question: ${question}

Return JSON:
{
  "answer": "",
  "sources": [],
  "confidence": ""
}
`;

  try {
    const response = await Promise.race([
      groq.chat.completions.create({
       model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("LLM timeout")), 5000)
      ),
    ]);

    let text = response.choices[0].message.content;

    text = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.log("RAW LLM:", text);

      return {
        answer: docs[0]?.content || "Parsing failed",
        sources: [],
        confidence: "medium",
      };
    }

    return responseSchema.parse(parsed);
  } catch (err) {
    console.error("LLM ERROR:", err.message);
    return {
      answer: docs[0]?.content || "LLM failed",
      sources: [],
      confidence: "medium",
    };
  }
};