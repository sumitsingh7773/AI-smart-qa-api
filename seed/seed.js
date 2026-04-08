import mongoose from "mongoose";
import dotenv from "dotenv";
import Doc from "../src/models/Doc.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const docs = [
  {
    title: "Refund Policy",
    content: "Refunds are processed within 5-7 business days.",
    tags: ["refund"],
  },
  {
    title: "Shipping Policy",
    content: "Shipping takes 3-5 days.",
    tags: ["shipping"],
  },
  {
    title: "Cancellation",
    content: "Cancel within 24 hours.",
    tags: ["cancel"],
  },
  {
    title: "Support",
    content: "Email support@example.com",
    tags: ["help"],
  },
  {
    title: "Warranty",
    content: "1-year warranty included.",
    tags: ["warranty"],
  },
];

await Doc.deleteMany();
await Doc.insertMany(docs);

console.log("Data Seeded!");
process.exit();