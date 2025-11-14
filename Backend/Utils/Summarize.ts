import { ChatCohere } from "@langchain/cohere";
import dotenv from "dotenv";
dotenv.config();

const llm = new ChatCohere({
  model: "command-a-03-2025",
  temperature: 0,
  apiKey: process.env.COHERE_API_KEY,
});

export async function SummarizeMail(emailContent: string): Promise<string> {
  const prompt = `
Summarize the following email in 2-3 sentences.

STRICT RULES:
- Output ONLY the summary.
- Do NOT include "Summary:", headings, explanations, or any extra text.
- Keep it concise, neutral, and factual.

Email:
"${emailContent}"
`;

  const completion = await llm.invoke([{ role: "user", content: prompt }]);

  console.log("Cohere Output:", completion);

  const content = completion.content;

  if (typeof content === "string") {
    return content;
  }

  const merged = content
    .map((c: any) => ("text" in c ? c.text : String(c)))
    .join("");

  return merged;
}

