import axios from "axios";

const API_KEY = process.env.GEMINI_API_KEY;

const ALLOWED_LABELS = [
    "Interested",
    "Meeting Booked",
    "Not Interested",
    "Spam",
    "Out of Office"
];

export async function classifyEmail(content: string): Promise<string> {
    try {
        const prompt = `
Classify the following email into **only one** of the labels below:

- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Email Content:
"${content}"

Rules:
- Return only the label, no explanation.
- If unsure, choose the closest meaningful category.
    `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const body = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        };

        const response = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" }
        });

        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        console.log("Gemini Output:", text);

        const normalized = text.replace(/[^a-zA-Z ]/g, "").trim();

        const matched = ALLOWED_LABELS.find(
            (label) => label.toLowerCase() === normalized.toLowerCase()
        );

        if (!matched) {
            console.warn("Unknown category from Gemini:", normalized);
            return "Not Interested";
        }

        return matched;

    } catch (err: any) {
        console.error("Gemini Error:", err.response?.data || err.message);
        return "Not Interested";
    }
}
