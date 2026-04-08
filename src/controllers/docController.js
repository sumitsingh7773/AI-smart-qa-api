import Doc from "../models/Doc.js";

export const getDocs = async (req, res) => {
  const docs = await Doc.find();
  res.json(docs);
};