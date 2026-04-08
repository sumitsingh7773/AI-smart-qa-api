import { retrieveDocs } from "../services/retrievalService.js";
import { generateAnswer } from "../services/llmService.js";

export const askQuestion = async (req, res, next) => {
  try {
    console.log("STEP 1: Request received");

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    console.log("STEP 2: Question ->", question);

    const docs = await retrieveDocs(question);

    console.log("STEP 3: Docs found ->", docs.length);
    if (!docs.length) {
      return res.json({
        answer: "Not found in knowledge base",
        sources: [],
        confidence: "low",
      });
    }

const result = await generateAnswer(question, docs);
result.sources = docs.map((doc) => doc._id.toString());
    console.log("STEP 4: LLM result received");
    const confidence =
      docs.length === 0
        ? "low"
        : docs.length === 1
        ? "medium"
        : "high";

    result.confidence = confidence;

    res.json(result);
  } catch (err) {
    console.error("ASK ERROR:", err.message);
    res.status(200).json({
      answer: "Something went wrong, showing best available data",
      sources: [],
      confidence: "low",
    });
  }
};