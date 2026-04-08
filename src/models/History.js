import mongoose from "mongoose";
const historySchema = new mongoose.Schema({
  userId: String,
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("History", historySchema);