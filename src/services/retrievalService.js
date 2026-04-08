import Doc from "../models/Doc.js";

export const retrieveDocs = async (question) => {
  const keywords = question.toLowerCase().split(" ");

  const docs = await Doc.find();

  const scoredDocs = docs.map((doc) => {
    let score = 0;

    keywords.forEach((word) => {
      if (doc.content.toLowerCase().includes(word)) {
        score++;
      }
    });

    return { doc, score };
  });

  return scoredDocs
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.doc);
};