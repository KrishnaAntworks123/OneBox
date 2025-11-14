import { ChatCohere } from "@langchain/cohere";
import dotenv from "dotenv";
dotenv.config();

const ALLOWED_LABELS = [
  "Interested",
  "Meeting Booked",
  "Not Interested",
  "Spam",
  "Out of Office",
];

const cohereClassifier = new ChatCohere({
  model: "command-a-03-2025",
  temperature: 0,
  apiKey: process.env.COHERE_API_KEY,
});

export async function classifyEmail(content: string): Promise<string> {
  try {
    const prompt = `
Classify the following email into **only ONE** of the labels below:

- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Email:
"${content}"

RULES:
- Output ONLY the label.
- No explanations, no extra text.
- If unsure, pick the closest meaningful category.
    `;

    const completion = await cohereClassifier.invoke([
      { role: "user", content: prompt },
    ]);

    console.log("Cohere Classifier Output:", completion);

    const raw = completion.content;

    let text =
      typeof raw === "string"
        ? raw.trim()
        : raw
            .map((b: any) => b.text ?? String(b))
            .join("")
            .trim();    

    //Clean the text
    const normalized = text.replace(/[^a-zA-Z ]/g, "").trim();

    //Only allow specific labels
    const matched = ALLOWED_LABELS.find(
      (l) => l.toLowerCase() === normalized.toLowerCase()
    );

    if (!matched) {
      console.warn("Unknown label from Cohere:", normalized);
      return "Not Interested";
    }

    return matched;
  } catch (err) {
    console.error("Cohere Classifier Error:", err);
    return "Not Interested";
  }
}
